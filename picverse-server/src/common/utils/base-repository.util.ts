import { FilterQuery, Model, Document, UpdateQuery, AnyKeys, CreateOptions, InferId, QueryOptions, PipelineStage, Query } from "mongoose";

import { InfiniteResponse, PaginationResponse } from "@common/dtos";
import { CacheService, joinCacheKey } from "@modules/cache";

export class Repository<T extends Document> {
  protected readonly _model: Model<T>;
  protected readonly cacheService?: CacheService;
  protected readonly cachePrefix: string;

  protected constructor(model: Model<T>, cacheService?: CacheService, cachePrefix?: string) {
    this._model = model;
    this.cacheService = cacheService;
    this.cachePrefix = cachePrefix || model.modelName.toLowerCase();
  }

  public getModel(): Model<T> {
    return this._model;
  }

  public async count(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter);
  }

  public async create(docs: Array<AnyKeys<T>>, options?: CreateOptions): Promise<Array<T>>;
  public async create(doc: AnyKeys<T>, options?: CreateOptions): Promise<T>;
  public async create(docOrDocs: AnyKeys<T> | Array<AnyKeys<T>>, options: CreateOptions = {}): Promise<T | Array<T>> {
    const isArrayInput: boolean = Array.isArray(docOrDocs);

    const result = isArrayInput ? await this._model.create(docOrDocs as Array<AnyKeys<T>>, options) : await new this._model(docOrDocs as AnyKeys<T>).save(options);

    if (this.cacheService) {
      const docsToCache = isArrayInput ? (result as Array<T>) : [result as T];
      await Promise.all(
        docsToCache.map((doc) => {
          const cacheKey = joinCacheKey(this.cachePrefix, doc._id.toString());
          return this.cacheService?.set(cacheKey, doc);
        }),
      );

      await this.invalidateCache();
    }

    return result;
  }

  public async find(idOrFilter: string | FilterQuery<T>, options: Repository.FindOptions = {}): Promise<T | null> {
    if (!idOrFilter) return null;

    const { select, populate, force, cachePostfix } = options;

    const boundCacheKey = joinCacheKey(this.cachePrefix, JSON.stringify({ idOrFilter, select }), cachePostfix);

    if (!force && this.cacheService) {
      const cachedDocument = await this.cacheService.get<T>(boundCacheKey);
      if (cachedDocument) return cachedDocument;
    }

    const query = typeof idOrFilter === "string" ? this._model.findById(idOrFilter) : this._model.findOne(idOrFilter);

    if (select) query.select(select);
    if (populate) query.populate(populate);

    const document: T = await query.lean<T>();

    if (document && this.cacheService) {
      await this.cacheService.set(boundCacheKey, document);
    }

    return document;
  }

  public async findMultiple(filter: FilterQuery<T>, options?: Repository.FindMultipleOptions<T>): Promise<Array<T>>;
  public async findMultiple<K>(pipeline: PipelineStage[], options?: Repository.FindMultipleOptions<T>): Promise<Array<K>>;
  public async findMultiple(
    filterOrPipeline: FilterQuery<T> | PipelineStage[],
    options: Repository.FindMultipleOptions<T> = { postProcessData: (data) => data },
  ): Promise<Array<T>> {
    const { select, populate, sort, force, cachePostfix } = options;
    const cacheKey = joinCacheKey(this.cachePrefix, "listing", JSON.stringify({ filterOrPipeline, select, populate, sort }), cachePostfix);

    if (!force && this.cacheService) {
      const cachedDocuments = await this.cacheService.get<Array<T>>(cacheKey);
      if (cachedDocuments) return cachedDocuments;
    }

    const isAggregate = Array.isArray(filterOrPipeline);
    const query = isAggregate ? this._model.aggregate(filterOrPipeline) : this._model.find(filterOrPipeline);

    if (!isAggregate) {
      if (select) (query as Query<Array<T>, T>).select(select);
      if (populate) (query as Query<Array<T>, T>).populate(populate);
      if (sort) (query as Query<Array<T>, T>).sort(sort);
    }

    const documents = await query.exec();

    if (documents.length > 0 && this.cacheService) {
      await this.cacheService.set(cacheKey, documents);
    }

    return options.postProcessData?.(documents) || documents;
  }

  public async findMultiplePaging(filter: FilterQuery<T>, pagination: Pagination, options?: Repository.FindMultipleOptions<T>): Promise<PaginationResponse<T>>;
  public async findMultiplePaging(pipeline: PipelineStage[], pagination: Pagination, options?: Repository.FindMultipleOptions<T>): Promise<PaginationResponse<T>>;
  public async findMultiplePaging(
    filterOrPipeline: FilterQuery<T> | PipelineStage[],
    pagination: Pagination,
    options: Repository.FindMultipleOptions<T> = { postProcessData: (data) => data },
  ): Promise<PaginationResponse<T>> {
    const { page, limit } = pagination;
    const { select, populate, sort, force, cachePostfix } = options;
    const isAggregate = Array.isArray(filterOrPipeline);

    const cacheKey = joinCacheKey(
      this.cachePrefix,
      "pagination-listing",
      isAggregate ? "aggregate" : "query",
      JSON.stringify({ pagination, filterOrPipeline, select, populate, sort }),
      cachePostfix,
    );
    const cachedDocuments: PaginationResponse<T> | null = force ? null : await this.cacheService?.get<PaginationResponse<T>>(cacheKey);
    if (cachedDocuments) return cachedDocuments;

    const skip: number = (page - 1) * limit;
    const query = isAggregate ? this._model.aggregate([...filterOrPipeline, { $skip: skip }, { $limit: limit }]) : this._model.find(filterOrPipeline).skip(skip).limit(limit);

    if (!isAggregate) {
      if (select) (query as Query<Array<T>, T>).select(select);
      if (populate) (query as Query<Array<T>, T>).populate(populate);
      if (sort) (query as Query<Array<T>, T>).sort(sort);
    }

    const [documents, documentCount] = await Promise.all([query.exec(), Array.isArray(filterOrPipeline) ? this.count({}) : this._model.countDocuments(filterOrPipeline)]);
    const pages: number = Math.ceil(documentCount / limit);

    const response: PaginationResponse<T> = {
      data: (await options.postProcessData?.(documents)) || documents,
      meta: {
        page,
        limit,
        pages,
      },
    };

    if (documents.length > 0) await this.cacheService?.set(cacheKey, response);

    return response;
  }

  public async findMultipleInfinite(filter: FilterQuery<T>, pagination: Pagination, options?: Repository.FindMultipleOptions<T>): Promise<InfiniteResponse<T>>;
  public async findMultipleInfinite(pipeline: PipelineStage[], pagination: Pagination, options?: Repository.FindMultipleOptions<T>): Promise<InfiniteResponse<T>>;
  public async findMultipleInfinite(
    filterOrPipeline: FilterQuery<T> | PipelineStage[],
    pagination: Pagination,
    options: Repository.FindMultipleOptions<T> = { postProcessData: (data) => data },
  ): Promise<InfiniteResponse<T>> {
    const { select, populate, sort, force, cachePostfix } = options;
    const isAggregate = Array.isArray(filterOrPipeline);
    const { page, limit } = pagination;

    const cacheKey = joinCacheKey(
      this.cachePrefix,
      "infinite-listing",
      isAggregate ? "aggregate" : "query",
      JSON.stringify({ page, limit, filterOrPipeline, select, populate, sort }),
      cachePostfix,
    );
    if (!force && this.cacheService) {
      const cachedDocuments = await this.cacheService.get<InfiniteResponse<T>>(cacheKey);
      if (cachedDocuments) return cachedDocuments;
    }

    const skip: number = (page - 1) * limit;
    const query = isAggregate
      ? this._model.aggregate([...filterOrPipeline, { $skip: skip }, { $limit: limit }])
      : this._model
          .find(filterOrPipeline)
          .skip((page - 1) * limit)
          .limit(limit);

    if (!isAggregate) {
      if (select) (query as Query<Array<T>, T>).select(select);
      if (populate) (query as Query<Array<T>, T>).populate(populate);
      if (sort) (query as Query<Array<T>, T>).sort(sort);
    }

    const documents = await query.exec();

    const nextCursor = documents.length === limit ? page + 1 : undefined;

    const response: InfiniteResponse<T> = {
      data: (await options.postProcessData?.(documents)) || documents,
      nextCursor,
    };

    if (documents.length > 0 && this.cacheService) {
      await this.cacheService.set(cacheKey, response);
    }

    return response;
  }

  public async aggregate<T = any>(pipeline: PipelineStage[], options: Repository.AggregateOptions = {}): Promise<T[]> {
    const { force, cachePostfix } = options;

    const cacheKey = joinCacheKey(this.cachePrefix, "aggregate", JSON.stringify(pipeline), cachePostfix);

    if (!force && this.cacheService) {
      const cachedResult = await this.cacheService.get<T[]>(cacheKey);
      if (cachedResult) return cachedResult;
    }

    const result = await this._model.aggregate(pipeline).exec();

    if (result.length > 0 && this.cacheService) {
      await this.cacheService.set(cacheKey, result);
    }

    return result;
  }

  public async update(idOrFilter: string | FilterQuery<T>, updateData: UpdateQuery<T>, options: QueryOptions = {}): Promise<T | null> {
    const query = typeof idOrFilter === "string" ? { _id: idOrFilter } : idOrFilter;
    const updatedDocument = await this._model.findOneAndUpdate(query, updateData, { ...options, new: true }).exec();

    if (updatedDocument) {
      await this.invalidateCache(updatedDocument._id.toString());
    }

    return updatedDocument;
  }

  public async delete(idOrFilter: string | FilterQuery<T>): Promise<boolean> {
    const query = typeof idOrFilter === "string" ? { _id: idOrFilter } : idOrFilter;
    const deletedDocument = await this._model.findOneAndDelete(query).exec();

    if (deletedDocument) {
      await this.invalidateCache(deletedDocument._id.toString());
    }

    return !!deletedDocument;
  }

  public async deleteMultiple(idOrFilter: string | FilterQuery<T>): Promise<boolean> {
    const query = typeof idOrFilter === "string" ? { _id: idOrFilter } : idOrFilter;
    const deletedDocument = await this._model.find(query, "_id").exec();

    if (deletedDocument.length === 0) {
      return false;
    }

    await this._model.deleteMany(query);

    if (deletedDocument) {
      await Promise.all(
        deletedDocument.map(async (doc) => {
          return this.invalidateCache(doc._id.toString());
        }),
      );
    }

    return !!deletedDocument;
  }

  public async safeDelete(idOrFilter: string | FilterQuery<T>, options?: QueryOptions): Promise<boolean> {
    if (!this._model.schema.path("isDeleted")) return false;
    return !!(await this.update(idOrFilter, { isDeleted: true } as any, options));
  }

  public async exists(filter: FilterQuery<T>): Promise<{ _id: InferId<T> } | null> {
    return this._model.exists(filter);
  }

  private async invalidateCache(id?: string, pattern?: RegExp): Promise<void> {
    if (id) {
      const withIdPattern: RegExp = pattern || new RegExp(`.*${id}.*$`);
      this.cacheService?.del(withIdPattern, this.cachePrefix);
    }

    const allStringPattern: RegExp = new RegExp(`.*listing.*$`);

    this.cacheService?.del(allStringPattern, this.cachePrefix);
  }
}

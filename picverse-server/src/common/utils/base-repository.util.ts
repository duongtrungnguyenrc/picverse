import {
  FilterQuery,
  Model,
  PopulateOptions,
  Document,
  UpdateQuery,
  AnyKeys,
  CreateOptions,
  InferId,
  SortOrder,
  QueryOptions,
} from "mongoose";

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
  public async create(docOrDocs: AnyKeys<T> | Array<AnyKeys<T>>, options?: CreateOptions): Promise<T | Array<T>> {
    const isArrayInput = Array.isArray(docOrDocs);

    const result = isArrayInput
      ? await this._model.create(docOrDocs as Array<AnyKeys<T>>, options)
      : await new this._model(docOrDocs as AnyKeys<T>).save(options);

    if (this.cacheService) {
      const docsToCache = isArrayInput ? (result as Array<T>) : [result as T];
      await Promise.all(
        docsToCache.map((doc) => {
          const cacheKey = joinCacheKey(this.cachePrefix, doc._id.toString());
          return this.cacheService?.set(cacheKey, doc);
        }),
      );
    }

    return result;
  }

  public async find(
    idOrFilter: string | FilterQuery<T>,
    select?: string | string[] | Record<string, number | boolean | string | object>,
    populate?: PopulateOptions | Array<PopulateOptions | string>,
    force: boolean = false,
    cachePostfix: string = "",
  ): Promise<T | null> {
    if (!idOrFilter) return null;

    const boundCacheKey = joinCacheKey(this.cachePrefix, JSON.stringify({ idOrFilter, select }), cachePostfix);

    if (!force && this.cacheService) {
      const cachedDocument = await this.cacheService.get<T>(boundCacheKey);
      if (cachedDocument) return cachedDocument;
    }

    const query = typeof idOrFilter === "string" ? this._model.findById(idOrFilter) : this._model.findOne(idOrFilter);

    if (select) query.select(select);
    if (populate) query.populate(populate);

    const document = await query.exec();

    if (document && this.cacheService) {
      await this.cacheService.set(boundCacheKey, document);
    }

    return document;
  }

  public async findMultiple(
    filter: FilterQuery<T>,
    select?: string | string[] | Record<string, number | boolean | string | object>,
    populate?: PopulateOptions | Array<PopulateOptions | string>,
    sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null,
    force: boolean = false,
    cachePostfix: string = "",
  ): Promise<Array<T>> {
    const cacheKey = joinCacheKey(this.cachePrefix, "listing", JSON.stringify({ filter, select, populate, sort }), cachePostfix);

    if (!force && this.cacheService) {
      const cachedDocuments = await this.cacheService.get<Array<T>>(cacheKey);
      if (cachedDocuments) return cachedDocuments;
    }

    const query = this._model.find(filter);

    if (select) query.select(select);
    if (populate) query.populate(populate);
    if (sort) query.sort(sort);

    const documents = await query.exec();

    if (documents.length > 0 && this.cacheService) {
      await this.cacheService.set(cacheKey, documents);
    }

    return documents;
  }

  public async findMultiplePaging(
    filter: FilterQuery<T>,
    pagination: Pagination,
    select?: string | string[] | Record<string, number | boolean | string | object>,
    populate?: PopulateOptions | Array<PopulateOptions | string>,
    sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null,
    force?: boolean,
    cachePostfix?: string,
  ): Promise<PaginationResponse<T>> {
    const { page, limit } = pagination;

    const cacheKey = joinCacheKey(
      this.cachePrefix,
      "listing",
      JSON.stringify({ pagination, filter, select, populate, sort }),
      cachePostfix,
    );

    const cachedDocuments: PaginationResponse<T> | null = force
      ? null
      : await this.cacheService?.get<PaginationResponse<T>>(cacheKey);

    if (cachedDocuments) return cachedDocuments;

    const skip: number = (page - 1) * limit;
    const query = this._model.find(filter).skip(skip).limit(limit);

    if (select) query.select(select);
    if (populate) query.populate(populate);
    if (sort) query.sort(sort);

    const [documents, documentCount] = await Promise.all([query.exec(), this._model.countDocuments(filter)]);
    const pages: number = Math.ceil(documentCount / limit);

    const response: PaginationResponse<T> = {
      data: documents,
      meta: {
        page,
        limit,
        pages,
      },
    };

    if (documents.length > 0) await this.cacheService?.set(cacheKey, response);

    return response;
  }

  public async findMultipleInfinite(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    select?: string | string[] | Record<string, number | boolean | string | object>,
    populate?: PopulateOptions | Array<PopulateOptions | string>,
    sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null,
    force?: boolean,
    cachePostfix?: string,
  ): Promise<InfiniteResponse<T>> {
    const cacheKey = joinCacheKey(
      this.cachePrefix,
      "infinite-listing",
      JSON.stringify({ page, limit, filter, select, populate, sort }),
      cachePostfix,
    );

    if (!force && this.cacheService) {
      const cachedDocuments = await this.cacheService.get<InfiniteResponse<T>>(cacheKey);
      if (cachedDocuments) return cachedDocuments;
    }

    const [documentsCount, documents] = await Promise.all([
      this.count(filter),
      this._model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(select)
        .populate(populate)
        .sort(sort)
        .exec(),
    ]);

    const nextCursor = documentsCount < limit ? page + 1 : undefined;

    const response: InfiniteResponse<T> = {
      data: documents,
      nextCursor,
    };

    if (documents.length > 0 && this.cacheService) {
      await this.cacheService.set(cacheKey, response);
    }

    return response;
  }

  public async update(
    idOrFilter: string | FilterQuery<T>,
    updateData: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T | null> {
    const query = typeof idOrFilter === "string" ? { _id: idOrFilter } : idOrFilter;
    const updatedDocument = await this._model.findOneAndUpdate(query, updateData, { ...options, new: true }).exec();

    if (updatedDocument) {
      await this.refreshCache(updatedDocument._id.toString());
    }

    return updatedDocument;
  }

  public async delete(idOrFilter: string | FilterQuery<T>): Promise<boolean> {
    const query = typeof idOrFilter === "string" ? { _id: idOrFilter } : idOrFilter;
    const deletedDocument = await this._model.findOneAndDelete(query).exec();

    if (deletedDocument) {
      await this.refreshCache(deletedDocument._id.toString());
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

  private async refreshCache(id: string, pattern?: RegExp): Promise<void> {
    if (!this.cacheService) return;

    const withIdPattern = pattern || new RegExp(`.*${id}.*$`);
    const allStringPattern = new RegExp(`.*listing.*$`);

    await Promise.all([
      this.cacheService.del(withIdPattern, this.cachePrefix),
      this.cacheService.del(allStringPattern, this.cachePrefix),
    ]);
  }
}

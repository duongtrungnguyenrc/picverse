declare namespace Repository {
  type FindOptions = {
    select?: string | string[] | Record<string, number | boolean | string | object>;
    populate?: PopulateOptions | Array<PopulateOptions | string>;
    force?: boolean;
    cachePostfix?: string;
  };

  type FindMultipleOptions<T> = FindOptions & {
    sort?: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][] | undefined | null;
    postProcessData?: (data: Array<T>) => Array<T> | Promise<Array<T>>;
  };

  type AggregateOptions = Pick<FindOptions, "force" | "cachePostfix">;
}

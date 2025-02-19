declare type DocumentId = import("mongoose").Types.ObjectId;

declare type Pagination = {
  page: number;
  limit: number;
};

declare type JwtSessionPayload = {
  uid: DocumentId;
  pid: DocumentId;
  sid: string;
};

declare type JwtPayload = JwtSessionPayload & {
  exp?: number;
  iat?: number;
};

declare type RequestAgent = {
  deviceInfo: string;
  browserInfo: string;
};

declare type CacheWrapOptions<T> = {
  cacheKeys: string[];
  getCacheData?: (service: CacheService, cacheKey: string, defaultCachedData: T) => T;
};

// Express global override

declare namespace Express {
  namespace Multer {
    interface File {
      id?: DocumentId;
      bucketName?: string;
    }
  }
}

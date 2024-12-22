declare type DocumentId = import("mongoose").Types.ObjectId;

declare type Pagination = {
  page: number;
  limit: number;
};

declare type JwtPayload = {
  exp?: number;
  iat?: number;
  uid: DocumentId;
  sub: string;
};

declare type RequestAgent = {
  deviceInfo: string;
  browserInfo: string;
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

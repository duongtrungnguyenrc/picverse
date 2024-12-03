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

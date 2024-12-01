declare type DocumentId = import("mongoose").Types.ObjectId;

declare type Pagination = {
  page: number;
  limit: number;
};


declare type JwtPayload = {
  exp?: number;
  iat?: number;
  sub: string;
};

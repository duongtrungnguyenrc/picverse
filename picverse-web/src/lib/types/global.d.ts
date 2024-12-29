declare type BaseModel = {
  _id: string;
};

declare type TimeStampModel = {
  createdAt: string;
  updatedAt: string;
};

declare type ListMode = {
  name: string;
  icon: ReactElement;
  style: string;
};

declare type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

declare type ErrorResponse = {
  message: string | string[];
  error?: string;
  statusCode?: number;
};

declare type AxiosError = import("axios").AxiosError<ErrorResponse>;

declare type PaginationMeta = {
  pages: number;
  page: number;
  limit: number;
};

declare type PaginationResponse<T> = {
  meta: PaginationMeta;
  data: T[];
};

declare type InfiniteResponse<T> = {
  nextCursor?: number;
  data: Array<T>;
};

declare type Pagination = {
  page: number;
  limit: number;
};

declare type StatusResponse = {
  message: string;
};

declare type UsePaginationQueryResult<T> = {
  onChangePage: (page: number) => void;
} & PaginationMeta &
  import("@tanstack/react-query").UseQueryResult<PaginationResponse<T>, AxiosError<ErrorResponse>>;

declare type ValidationSchema<T> = {
  [k in keyof T]: import("zod").ZodTypeAny;
};

declare type SearchParams = { [key: string]: string | string[] | undefined };

declare type Route = {
  name: string;
  path: string;
  description?: string;
  icon?: import("react").ReactElement;
};

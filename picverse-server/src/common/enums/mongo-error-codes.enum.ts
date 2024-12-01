export enum MongoErrorCodes {
  DUPLICATE_KEY = 11000, // E11000 duplicate key error
  CANNOT_CREATE_INDEX = 67, // Cannot create index
  QUERY_FAILURE = 2, // General query failure
  BAD_VALUE = 2, // Bad value error (e.g., on insert)
  UNAUTHORIZED = 13, // Unauthorized error
  UNKNOWN_ERROR = 8, // Unknown error
  NAMESPACE_NOT_FOUND = 26, // Namespace (e.g., collection) not found
  WRITE_CONFLICT = 112, // Write conflict error
  EXCEEDED_TIME_LIMIT = 50, // Exceeded time limit
}

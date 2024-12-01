import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { MongoServerError } from "mongodb";

import { MongoErrorCodes } from "../enums";

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorResponse = this.handleMongoError(exception);

    return response.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private handleMongoError(exception: MongoServerError) {
    switch (exception.code) {
      case MongoErrorCodes.DUPLICATE_KEY:
        return {
          statusCode: HttpStatus.CONFLICT,
          message: this.getDuplicateKeyErrorMessage(exception),
        };

      case MongoErrorCodes.CANNOT_CREATE_INDEX:
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Cannot create index. Check index options or constraints.",
        };

      case MongoErrorCodes.UNAUTHORIZED:
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Unauthorized operation. Please check permissions.",
        };

      case MongoErrorCodes.NAMESPACE_NOT_FOUND:
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Requested collection or namespace not found.",
        };

      case MongoErrorCodes.WRITE_CONFLICT:
        return {
          statusCode: HttpStatus.CONFLICT,
          message: "Write conflict occurred. Try the operation again.",
        };

      case MongoErrorCodes.EXCEEDED_TIME_LIMIT:
        return {
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: "Operation timed out.",
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "An unexpected error occurred with MongoDB.",
        };
    }
  }

  private getDuplicateKeyErrorMessage(exception: MongoServerError): string {
    const key: string = Object.keys(exception.keyValue)[0];
    return `${key} already exists. Please use a different ${key}.`;
  }
}

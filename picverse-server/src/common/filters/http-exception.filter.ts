import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();

    const message =
      typeof exceptionResponse === "object" && Array.isArray(exceptionResponse["message"])
        ? exceptionResponse["message"].join(", ")
        : exceptionResponse["message"] || exception.message;

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

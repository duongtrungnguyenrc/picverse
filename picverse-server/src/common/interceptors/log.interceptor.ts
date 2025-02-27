import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { Request } from "express";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;

    this.logger.debug(
      `[Request] ${method} ${url} - Body: ${JSON.stringify(body, undefined, 4)} - Query: ${JSON.stringify(query, undefined, 4)} - Params: ${JSON.stringify(params, undefined, 4)}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        this.logger.debug(`[Response] ${method} ${url} - ${res.statusCode} - ${Date.now() - now}ms - Data: ${JSON.stringify(data, undefined, 4)}`);
      }),
    );
  }
}

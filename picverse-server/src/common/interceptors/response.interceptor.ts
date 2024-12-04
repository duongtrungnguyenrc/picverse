import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Request } from "express";
import { Types } from "mongoose";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        if (request.method === "get" && (data === null || data === undefined)) {
          throw new NotFoundException("Resource not found");
        }

        const isDateString = (value: string): boolean => !isNaN(Date.parse(value));

        const formatDate = (date: Date): string => (date.toISOString().includes("T00:00:00.000Z") ? date.toLocaleDateString("vi-VN") : date.toLocaleString("vi-VN"));

        const transformResponseObject = (obj: any): any => {
          if (obj instanceof Date) {
            return formatDate(obj);
          }

          if (typeof obj === "string" && isDateString(obj)) {
            return formatDate(new Date(obj));
          }

          if (Array.isArray(obj)) {
            return obj.map(transformResponseObject);
          }

          if (obj instanceof Types.ObjectId)
            if (obj && typeof obj === "object") {
              return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, transformResponseObject(value)]));
            }

          return obj;
        };

        return transformResponseObject(data);
      }),
    );
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Types } from "mongoose";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const isDateString = (value: any): boolean => {
          return typeof value === "string" && !isNaN(Date.parse(value));
        };

        const formatDate = (date: Date): string => {
          return date.toISOString();
        };

        const transformResponseObject = (obj: any): any => {
          if (obj instanceof Date) {
            return formatDate(obj);
          } else if (isDateString(obj)) {
            return obj;
          } else if (Array.isArray(obj)) {
            return obj.map(transformResponseObject);
          } else if (obj instanceof Types.ObjectId) {
            return obj.toString();
          } else if (obj && typeof obj === "object") {
            if (obj.toObject) obj = obj.toObject();
            return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, transformResponseObject(value)]));
          }

          return obj;
        };


        return transformResponseObject(data);
      }),
    );
  }
}

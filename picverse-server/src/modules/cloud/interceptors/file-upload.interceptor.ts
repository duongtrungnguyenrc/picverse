import { Injectable, ExecutionContext, CallHandler } from "@nestjs/common";
import { NestInterceptor } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import * as multer from "multer";

import { LocalStorageService } from "../services";
import { ECloudStorage } from "../enums";

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(@Inject(LocalStorageService) private readonly localStorageService: LocalStorageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const storageType: ECloudStorage =
      (request.query.storage && Object.values(ECloudStorage).includes(request.query.storage as ECloudStorage) ? (request.query.storage as ECloudStorage) : undefined) ||
      ECloudStorage.LOCAL;

    const multerStorage: multer.StorageEngine | undefined = storageType === ECloudStorage.LOCAL ? this.localStorageService.getStorage() : undefined;

    const upload = multer({ storage: multerStorage }).single("file");

    return new Observable((observer) => {
      upload(request, request.res, (err: any) => {
        if (err) {
          observer.error(err);
        } else {
          next.handle().subscribe({
            next: (value) => observer.next(value),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        }
      });
    });
  }
}

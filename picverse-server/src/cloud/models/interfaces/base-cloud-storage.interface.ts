import { Response } from "express";

import { Resource, UploadFileDto } from "..";

export interface IStorageService {
  getAvailableSpace(accountId: DocumentId): Promise<number>;
  getTotalSpace(accountId: DocumentId): Promise<number>;
  uploadFile(accountId: DocumentId, file: Express.Multer.File, payload?: UploadFileDto): Promise<Resource>;
  getFile(resource: Resource, response: Response, width?: number, height?: number): Promise<void>;
  deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean>;
  listFiles(accountId: DocumentId): Promise<Array<{ id: string; name: string; size: number | null }>>;
}

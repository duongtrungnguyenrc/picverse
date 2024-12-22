import { Response } from "express";
import { Resource } from "../schemas";

export interface IStorageService {
  getAvailableSpace(accountId: DocumentId): Promise<number>;
  getTotalSpace(accountId: DocumentId): Promise<number>;
  uploadFile(accountId: DocumentId, file: Express.Multer.File, parentId?: DocumentId): Promise<boolean | Resource>;
  getFile(file: Resource, response: Response): Promise<void>;
  deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean>;
  listFiles(accountId: DocumentId): Promise<Array<{ id: string; name: string; size: number | null }>>;
}

import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { GridFSBucket, GridFSBucketWriteStream, GridFSBucketWriteStreamOptions } from "mongodb";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { Response } from "express";
import * as pump from "pump";

import { CreateFolderDto, UploadFileDto } from "../dtos";
import { ResourceService } from "./resource.service";
import { Resource, CloudStorage } from "../schemas";
import { IStorageService } from "../interfaces";
import { EResourceType } from "../enums";
import { Readable } from "stream";

@Injectable()
export class LocalStorageService implements IStorageService {
  constructor(
    @InjectModel(CloudStorage.name) private cloudStorageModel: Model<CloudStorage>,
    @InjectConnection("cloud") private connection: Connection,
    private readonly resourceService: ResourceService,
  ) {}

  async getAvailableSpace(accountId: DocumentId): Promise<number> {
    const storage: CloudStorage = await this.getStorageInfo(accountId);

    return storage.totalSpace - storage.usedSpace;
  }

  async getTotalSpace(accountId: DocumentId): Promise<number> {
    const storage: CloudStorage = await this.getStorageInfo(accountId);

    return storage.totalSpace;
  }

  listFiles(accountId: DocumentId): Promise<Array<{ id: string; name: string; size: number | null }>> {
    throw new Error("Method not implemented.");
  }

  async createFolder(accountId: DocumentId, createFolderDto: CreateFolderDto) {
    const { name, parentId } = createFolderDto;

    if (parentId) {
      const parent = await this.resourceService.find(parentId);
      if (!parent || parent.type !== EResourceType.FOLDER || !parent.isPrivate || parent.accountId.toString() !== accountId.toString()) {
        throw new BadRequestException("Invalid or unauthorized parent folder.");
      }
    }

    const folder = await this.resourceService.create({
      name,
      parentId: parentId || null,
      type: EResourceType.FOLDER,
      accountId,
    });

    return folder;
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, payload: UploadFileDto) {
    const storage = await this.getStorageInfo(accountId);
    const { parentId, fileName } = payload;

    if (storage.usedSpace + file.size > storage.totalSpace) {
      throw new ConflictException("Insufficient storage space.");
    }

    if (parentId) {
      const parent = await this.resourceService.find(parentId);

      if (!parent || parent.type !== EResourceType.FOLDER || parent.accountId.toString() !== accountId.toString()) {
        throw new BadRequestException("Invalid parent folder or unauthorized.");
      }
    }

    const uploadResult = await this._uploadFromMulterStream(file, fileName);

    const uploadedFile = await this.resourceService.create({
      name: fileName,
      parentId: parentId,
      referenceId: uploadResult.id,
      type: EResourceType.FILE,
      accountId,
      size: file.size,
      mimeType: file.mimetype,
    });

    storage.usedSpace += file.size || 0;
    await storage.save();

    return uploadedFile;
  }

  async getFile(file: Resource, response: Response): Promise<void> {
    try {
      const bucket = new GridFSBucket(this.connection.db);

      const fileExists = await bucket.find({ _id: new Types.ObjectId(file.referenceId) }).toArray();

      if (!fileExists || fileExists.length === 0) {
        throw new NotFoundException("File not found in storage.");
      }

      const downloadStream = bucket.openDownloadStream(new Types.ObjectId(file.referenceId));

      downloadStream.on("error", (err) => {
        response.status(500).send("Error downloading file." + err);
      });

      response.setHeader("Content-Type", file.mimeType || "application/octet-stream");

      downloadStream.pipe(response);
    } catch (error) {
      throw new NotFoundException("An error occurred while downloading the file.");
    }
  }

  async getItems(accountId: DocumentId, parentId: string | null) {
    const items = await this.resourceService.findMultiple({
      accountId,
      parentId: parentId || null,
    });

    return items;
  }

  async deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean> {
    if (!(file instanceof Resource)) {
      const fetchedResource: Resource = await this.resourceService.find(file);

      if (!fetchedResource) return false;
      file = fetchedResource;
    }

    await this.resourceService.delete(file._id);
    const bucket = new GridFSBucket(this.connection.db);

    bucket.delete;

    const storage = await this.getStorageInfo(accountId);
    storage.usedSpace -= file.size;
    await storage.save();

    return true;
  }

  async getTree(accountId: DocumentId, parentId: string | null = null): Promise<any> {
    const items = await this.getItems(accountId, parentId);

    return await Promise.all(
      items.map(async (item) => ({
        ...item.toObject(),
        children: item.type === EResourceType.FOLDER ? await this.getTree(accountId, item._id.toString()) : [],
      })),
    );
  }

  private async _uploadFromMulterStream(file: Express.Multer.File, fileName: string): Promise<LocalStorage.GridFsFile> {
    const streamOptions: LocalStorage.GridFsUploadOptions = {
      ...file,
      fileName: fileName,
      contentType: file.mimetype,
      id: new Types.ObjectId(),
      chunkSize: 261_120,
      bucketName: "fs",
    };

    return new Promise((resolve, reject) => {
      const writeStream = this._createUploadStream(streamOptions);
      const readStream = Readable.from(file.buffer);

      writeStream.on("error", reject);
      writeStream.on("finish", () => {
        resolve({
          id: writeStream.id,
          mimeType: file.mimetype,
          size: file.size,
        } as any);
      });

      pump([readStream, writeStream]);
    });
  }

  private _createUploadStream(options: LocalStorage.GridFsUploadOptions): GridFSBucketWriteStream {
    const settings: GridFSBucketWriteStreamOptions = {
      id: options.id,
      chunkSizeBytes: options.chunkSize,
      contentType: options.contentType,
    };

    const gfs = new GridFSBucket(this.connection.db, { bucketName: options.bucketName });
    return gfs.openUploadStream(options.fileName, settings);
  }

  private async getStorageInfo(accountId: DocumentId) {
    const storage = (await this.cloudStorageModel.findOne({ accountId })) || (await this.cloudStorageModel.create({ accountId }));

    if (!storage) {
      throw new NotFoundException("Storage not found for this account.");
    }
    return storage;
  }
}

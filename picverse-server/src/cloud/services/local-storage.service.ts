import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { GridFSBucket, GridFSBucketWriteStream, GridFSBucketWriteStreamOptions } from "mongodb";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { Response } from "express";
import { Readable } from "stream";
import * as sharp from "sharp";
import * as pump from "pump";

import { Resource, CloudStorage, IStorageService, EResourceType } from "../models";
import { CreateFolderDto, UploadFileDto } from "../models";
import { ResourceService } from "./resource.service";

@Injectable()
export class LocalStorageService implements IStorageService {
  private bucket = new GridFSBucket(this.connection.db);

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

    const webpBuffer = await sharp(file.buffer).webp({ quality: 90 }).toBuffer();

    const metadata = await sharp(webpBuffer).metadata();

    const uploadResult = await this._uploadFromMulterStream({ ...file, buffer: webpBuffer, mimetype: "image/webp", size: webpBuffer.length }, fileName);

    const uploadedFile = await this.resourceService.create({
      name: fileName,
      parentId: parentId,
      referenceId: uploadResult.id,
      type: EResourceType.FILE,
      accountId,
      size: file.size,
      mimeType: "image/webp",
      width: metadata.width,
      height: metadata.height,
    });

    storage.usedSpace += file.size || 0;
    await storage.save();

    return uploadedFile;
  }

  async getFile(resource: Resource, width?: number, height?: number): Promise<Blob> {
    const fileExists = await this.bucket.find({ _id: new Types.ObjectId(resource.referenceId) }).toArray();

    if (!fileExists.length) throw new NotFoundException("File not found in storage.");

    const downloadStream = this.bucket.openDownloadStream(new Types.ObjectId(resource.referenceId));

    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk));
      downloadStream.on("end", async () => {
        try {
          let buffer: Buffer = Buffer.concat(chunks as Uint8Array[]);

          if (width || height) {
            buffer = await sharp(buffer)
              .webp({ quality: 90 })
              .resize(width || undefined, height || undefined)
              .toBuffer();
          }

          resolve(new Blob([buffer], { type: "image/webp" }));
        } catch (err) {
          reject(err);
        }
      });
      downloadStream.on("error", reject);
    });
  }

  async getFileStream(resource: Resource, response: Response, width?: number, height?: number): Promise<void> {
    try {
      const fileExists = await this.bucket.find({ _id: new Types.ObjectId(resource.referenceId) }).toArray();

      if (!fileExists.length) throw new NotFoundException("File not found in storage.");

      const downloadStream = this.bucket.openDownloadStream(new Types.ObjectId(resource.referenceId));

      downloadStream.on("error", (err) => {
        response.status(500).send("Error downloading file." + err);
      });

      response.setHeader("Content-Type", "image/webp");

      if (width || height) {
        const transform = sharp().resize(width ? parseInt(width.toString()) : undefined, height ? parseInt(height.toString()) : undefined);

        downloadStream.pipe(transform).pipe(response);
      } else {
        downloadStream.pipe(response);
      }
    } catch (error) {
      response.status(500).send("An error occurred while downloading the file." + error);
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

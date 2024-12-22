import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { GridFSBucket } from "mongodb";
import { Response } from "express";
import * as multer from "multer";

import { GridFsStorage } from "@common/libs/gridfs";
import { Resource, CloudStorage } from "../schemas";
import { IStorageService } from "../interfaces";
import { CreateFolderDto } from "../dtos";
import { EResourceType } from "../enums";

@Injectable()
export class LocalStorageService implements IStorageService {
  private storage: multer.StorageEngine;

  constructor(
    @InjectModel(CloudStorage.name) private cloudStorageModel: Model<CloudStorage>,
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
    @InjectConnection("cloud") private connection: Connection,
  ) {
    this.storage = new GridFsStorage({
      client: connection.getClient(),
      db: connection.db,
    });
  }

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
      const parent = await this.resourceModel.findById(parentId);
      if (!parent || parent.type !== EResourceType.FOLDER || !parent.isPrivate || parent.accountId.toString() !== accountId.toString()) {
        throw new BadRequestException("Invalid or unauthorized parent folder.");
      }
    }

    const folder = await this.resourceModel.create({
      name,
      parentId: parentId || null,
      type: EResourceType.FOLDER,
      path: parentId ? `${parentId}/${name}` : `/${name}`,
      accountId,
      size: 0,
    });

    return folder;
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, parentId?: DocumentId) {
    const storage = await this.getStorageInfo(accountId);

    if (storage.usedSpace + file.size > storage.totalSpace) {
      throw new BadRequestException("Insufficient storage space.");
    }

    if (parentId) {
      const parent = await this.resourceModel.findById(parentId);

      if (!parent || parent.type !== EResourceType.FOLDER || parent.accountId.toString() !== accountId.toString()) {
        throw new BadRequestException("Invalid or unauthorized parent folder.");
      }
    }

    const uploadedFile = await this.resourceModel.create({
      name: file.originalname,
      parentId: parentId || null,
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

      const fileExists = await bucket.find({ filename: file.name }).toArray();

      if (!fileExists || fileExists.length === 0) {
        throw new NotFoundException("File not found in storage.");
      }

      const downloadStream = bucket.openDownloadStreamByName(file.name);

      downloadStream.on("error", (err) => {
        response.status(500).send("Error downloading file." + err);
      });

      response.setHeader("Content-Type", file.mimeType || "application/octet-stream");
      response.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

      downloadStream.pipe(response);
    } catch (error) {
      throw new NotFoundException("An error occurred while downloading the file.");
    }
  }

  async getItems(accountId: DocumentId, parentId: string | null) {
    const items = await this.resourceModel.find({
      accountId,
      parentId: parentId || null,
    });

    return items;
  }

  async deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean> {
    if (!(file instanceof Resource)) {
      const fetchedResource: Resource = await this.resourceModel.findById(file);

      if (!fetchedResource) return false;
      file = fetchedResource;
    }

    const storage = await this.getStorageInfo(accountId);
    storage.usedSpace -= file.size;
    await storage.save();

    await this.resourceModel.findByIdAndDelete(file._id);

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

  private async getStorageInfo(accountId: DocumentId) {
    const storage = (await this.cloudStorageModel.findOne({ accountId })) || (await this.cloudStorageModel.create({ accountId }));

    if (!storage) {
      throw new NotFoundException("Storage not found for this account.");
    }
    return storage;
  }

  public getStorage(): multer.StorageEngine {
    return this.storage;
  }
}

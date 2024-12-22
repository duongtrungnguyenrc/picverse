import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CloudCredentials, CloudCredentialsDocument, Resource } from "../schemas";
import { CreateFolderDto, UpdateFolderDto, UploadFileDto } from "../dtos";
import { IExternalStorageService, IStorageService } from "../interfaces";
import { DropboxStorageService } from "./dropbox-storage.service";
import { DriveStorageService } from "./drive-storage.service";
import { LocalStorageService } from "./local-storage.service";
import { ECloudStorage, EResourceType } from "../enums";
import { StatusResponseDto } from "@common/dtos";
import { getExpiredTime } from "@common/utils";
import { Response } from "express";

@Injectable()
export class CloudService {
  constructor(
    @InjectModel(CloudCredentials.name) private readonly oauthCredentialsModel: Model<CloudCredentialsDocument>,
    @InjectModel(Resource.name) private readonly resourceModel: Model<Resource>,
    private readonly dropboxStorageService: DropboxStorageService,
    private readonly driveStorageService: DriveStorageService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  async getExternalStorageAuthUrl(accountId: DocumentId, storage: ECloudStorage): Promise<string> {
    const cloudStorage: IExternalStorageService = this.getStorage(storage, true);
    return await cloudStorage.getAuthUrl(accountId);
  }

  async handleExternalStorageCallback(code: string, state: string, storage: ECloudStorage): Promise<StatusResponseDto> {
    const cloudStorage: IExternalStorageService = this.getStorage(storage, true);

    const { accountId, ...rest } = await cloudStorage.handleAuthCallback(code, state);

    await this.saveOAuthCredentials(accountId, storage, rest);

    return { message: `${storage} storage linked success.` };
  }

  async getFolderItems(accountId: DocumentId, folderId: DocumentId): Promise<Array<Resource>> {
    return [];
  }

  async createFolder(accountId: DocumentId, payload: CreateFolderDto): Promise<StatusResponseDto> {
    const { parentId, ...folder } = payload;

    if (parentId) {
      const parentResource: Resource = await this.resourceModel.findById(parentId);

      if (!parentResource || parentResource.type != EResourceType.FOLDER) {
        throw new BadRequestException("Parent folder not found.");
      }
    }

    await this.resourceModel.create({
      ...folder,
      type: EResourceType.FOLDER,
      parentId: parentId ? new Types.ObjectId(parentId) : undefined,
      accountId: accountId,
    });

    return { message: `Folder ${payload.name} created success` };
  }

  async updateFolder(accountId: DocumentId, folderId: DocumentId, payload: UpdateFolderDto): Promise<StatusResponseDto> {
    const { parentId, ...updates } = payload;

    if (parentId) {
      const parentResource: Resource = await this.resourceModel.findById(parentId, ["type"]);

      if (!parentResource || parentResource.type != EResourceType.FOLDER) {
        throw new BadRequestException("Parent folder not found.");
      }
    }

    const updatedFolder = await this.resourceModel.findOneAndUpdate(
      {
        _id: folderId,
        accountId: accountId,
      },
      {
        ...updates,
        parentId: new Types.ObjectId(parentId),
      },
    );

    if (!updatedFolder) {
      throw new BadRequestException("Folder not found or forbidden.");
    }

    return { message: "Folder updated success" };
  }

  async deleteFolder(accountId: DocumentId, folderId: DocumentId): Promise<StatusResponseDto> {
    const children: Array<Resource> = await this.resourceModel.find({
      accountId,
      parentId: folderId,
    });

    for (const child of children) {
      if (child.type === EResourceType.FOLDER) {
        await this.deleteFolder(accountId, child._id);
      } else {
        const storage: IStorageService = this.getStorage(child.storage);

        await storage.deleteFile(accountId, child._id);
      }
    }

    await this.resourceModel.findByIdAndDelete(folderId);

    return { message: "Folder deleted success" };
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, toStorage: ECloudStorage, payload: UploadFileDto): Promise<StatusResponseDto> {
    const storage: IStorageService = this.getStorage(toStorage);

    await storage.uploadFile(accountId, file, payload.parentId);

    return { message: `File ${file.filename} uploaded success` };
  }

  async getFile(accountId: DocumentId, fileId: DocumentId, response: Response): Promise<void> {
    const file: Resource = await this.resourceModel.findById(fileId);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    if (file.isPrivate && file.accountId.toString() !== accountId.toString()) {
      throw new ForbiddenException("Can not access private file.");
    }

    if (file.type !== EResourceType.FILE) {
      throw new BadRequestException("Item is not a valid file.");
    }

    const storage: IStorageService = this.getStorage(file.storage);

    await storage.getFile(file, response);
  }

  async deleteFile(accountId: DocumentId, fileId: DocumentId) {}

  private getStorage(storage: ECloudStorage, externalOnly: true): IExternalStorageService;
  private getStorage(storage: ECloudStorage, externalOnly?: false): IStorageService;
  private getStorage(storage: ECloudStorage, externalOnly: boolean = false): IStorageService | IExternalStorageService {
    switch (storage) {
      case ECloudStorage.DROPBOX:
        return this.dropboxStorageService;
      case ECloudStorage.DRIVE:
        return this.driveStorageService;
      default:
        if (externalOnly) {
          throw new Error("Invalid storage type: Only supporteds external storage services are allowed.");
        }
        return this.localStorageService;
    }
  }

  private async saveOAuthCredentials(accountId: DocumentId, storage: ECloudStorage, tokens: any) {
    const expiresAt = tokens.expiresIn ? getExpiredTime(tokens.expiresIn) : null;

    const credentials = await this.oauthCredentialsModel.findOneAndUpdate(
      { accountId: new Types.ObjectId(accountId), storage },
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        expiresAt,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    return credentials;
  }
}

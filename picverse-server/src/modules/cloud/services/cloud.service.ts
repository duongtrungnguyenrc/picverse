import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Response } from "express";

import {
  CreateFolderDto,
  GetStorageLinkStatusResponseDto,
  UpdateResourceDto,
  UploadFileDto,
  IExternalStorageService,
  IStorageService,
  ECloudStorage,
  EResourceType,
  CloudCredentials,
  Resource,
} from "../models";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { DropboxStorageService } from "./dropbox-storage.service";
import { DriveStorageService } from "./drive-storage.service";
import { LocalStorageService } from "./local-storage.service";
import { ResourceService } from "./resource.service";
import { getExpiredTime } from "@common/utils";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudService {
  constructor(
    @InjectModel(CloudCredentials.name) private readonly cloudCredentialsModel: Model<CloudCredentials>,
    private readonly resourceService: ResourceService,
    private readonly dropboxStorageService: DropboxStorageService,
    private readonly driveStorageService: DriveStorageService,
    private readonly localStorageService: LocalStorageService,
    private readonly configService: ConfigService,
  ) {}

  async getExternalStorageAuthUrl(accountId: DocumentId, storage: ECloudStorage): Promise<string> {
    const cloudStorage: IExternalStorageService = this.getStorage(storage, true);
    return cloudStorage.getAuthUrl(accountId);
  }

  async getStorageLinkStatus(accountId: DocumentId): Promise<GetStorageLinkStatusResponseDto> {
    const linkedCredentials = await this.cloudCredentialsModel.find({ accountId }, "storage");

    const defaultStatus: GetStorageLinkStatusResponseDto = Object.values(ECloudStorage).reduce(
      (prev, storage) => ({ ...prev, [storage]: false }),
      {} as GetStorageLinkStatusResponseDto,
    );

    return linkedCredentials.reduce((prev, credentials) => ({ ...prev, [credentials.storage]: true }), defaultStatus);
  }

  async getStorageSpaceStatus(accountId: DocumentId) {
    const credentials: Array<Pick<CloudCredentials, "storage">> = await this.cloudCredentialsModel.find({ accountId }, ["storage"]);

    return [ECloudStorage.LOCAL, ...credentials.map((credential) => credential.storage)].reduce(async (prevState, storageName) => {
      const storage: IStorageService = this.getStorage(storageName);
      return {
        ...prevState,
        [storageName]: await storage.getAvailableSpace(accountId),
      };
    }, {});
  }

  async unlinkExternalStorage(accountId: DocumentId, storage: ECloudStorage): Promise<StatusResponseDto> {
    const credentials = await this.cloudCredentialsModel.findByIdAndDelete({ accountId, storage });

    if (!credentials) {
      throw new BadRequestException(`You do not link with ${storage} storage to unlink`);
    }

    await this.resourceService.deleteMultiple({ accountId });

    return { message: `Unlink ${storage} storage success` };
  }

  async handleExternalStorageCallback(code: string, state: string, storage: ECloudStorage, response: Response): Promise<void> {
    const searchParams = new URLSearchParams();
    searchParams.append("storage", storage);

    try {
      const cloudStorage: IExternalStorageService = this.getStorage(storage, true);

      const { accountId, ...rest } = await cloudStorage.handleAuthCallback(code, state);

      await this.saveOAuthCredentials(accountId, storage, rest);
    } catch (error) {
      searchParams.append("error", error.message);
    }

    response.redirect(`${this.configService.get<string>("CLIENT_CLOUD_CALLBACK_URL")}?${searchParams}`);
  }

  async getResources(accountId: DocumentId, folderId: DocumentId | undefined, pagination: Pagination): Promise<InfiniteResponse<Resource>> {
    const parentFolder = await this.resourceService.find(folderId, { select: ["_id", "isPrivate", "accountId"] });

    if (folderId && !parentFolder) {
      throw new NotFoundException("Folder does not exists");
    }

    if (accountId?.toString() != parentFolder?.accountId.toString() && parentFolder?.isPrivate) {
      throw new ForbiddenException("Unable to access private resources, please contact the author and request viewing permission");
    }

    return await this.resourceService.findMultipleInfinite({ parentId: folderId, accountId }, pagination, { select: "-referenceId" });
  }

  async createFolder(accountId: DocumentId, payload: CreateFolderDto): Promise<StatusResponseDto> {
    const { parentId, ...folder } = payload;

    if (parentId) {
      const parentResource: Resource = await this.resourceService.find(parentId);

      if (!parentResource || parentResource.type != EResourceType.FOLDER) {
        throw new BadRequestException("Parent folder not found.");
      }
    }

    await this.resourceService.create({
      ...folder,
      type: EResourceType.FOLDER,
      parentId: parentId ? new Types.ObjectId(parentId) : undefined,
      accountId: accountId,
    });

    return { message: `Folder ${payload.name} created success` };
  }

  async updateResource(accountId: DocumentId, resourceId: DocumentId, payload: UpdateResourceDto): Promise<StatusResponseDto> {
    const { parentId, ...updates } = payload;

    if (parentId) {
      const parentResource: Resource = await this.resourceService.find(parentId, {
        select: ["type"],
      });

      if (!parentResource || parentResource.type != EResourceType.FOLDER) {
        throw new BadRequestException("Parent folder not found.");
      }
    }

    const updatedResource = await this.resourceService.update(
      {
        _id: resourceId,
        accountId: accountId,
      },
      {
        ...updates,
        parentId: parentId ? new Types.ObjectId(parentId) : null,
      },
    );

    if (!updatedResource) {
      throw new BadRequestException("Resource not found or forbidden.");
    }

    return { message: "Resource updated success" };
  }

  async deleteFolder(accountId: DocumentId, folderId: DocumentId): Promise<StatusResponseDto> {
    const children: Array<Resource> = await this.resourceService.findMultiple({
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

    await this.resourceService.delete(folderId);

    return { message: "Folder deleted success" };
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, payload: UploadFileDto, parentId?: DocumentId, raw?: true, index?: number): Promise<Resource>;

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, payload: UploadFileDto, parentId?: DocumentId, raw?: false, index?: number): Promise<StatusResponseDto>;

  async uploadFile(
    accountId: DocumentId,
    file: Express.Multer.File,
    payload: UploadFileDto,
    parentId?: DocumentId,
    raw?: boolean,
    index?: number,
  ): Promise<StatusResponseDto | Resource> {
    const storageHandler: IStorageService = this.getStorage(payload.storage ?? ECloudStorage.LOCAL);
    const fileName: string = payload.fileName || file.originalname;

    const availableSpace: number = await storageHandler.getAvailableSpace(accountId);

    if (file.size > availableSpace) {
      if (payload.storage) {
        throw new NotAcceptableException(`No available space to upload to ${payload.storage}`);
      }

      const credentials = await this.cloudCredentialsModel.find({ accountId });

      if (credentials.length === 0) {
        throw new NotAcceptableException("No available space to upload");
      }

      const currentIndex: number = index || 0;

      if (currentIndex + 1 > credentials.length) throw new NotAcceptableException("No available space to upload");

      return this.uploadFile(
        accountId,
        file,
        {
          ...payload,
          storage: credentials[currentIndex].storage,
        },
        parentId,
        undefined,
        currentIndex + 1,
      );
    }

    const uploadedResource = await storageHandler.uploadFile(accountId, file, {
      ...payload,
      fileName,
      parentId,
    });

    if (raw) {
      return uploadedResource;
    }

    return { message: `File ${fileName} uploaded success` };
  }

  async getFile(fileId: DocumentId, response: Response): Promise<void> {
    const file: Resource = await this.resourceService.find(fileId);

    if (!file) {
      throw new NotFoundException("File not found");
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

    return this.cloudCredentialsModel.findOneAndUpdate(
      { accountId: new Types.ObjectId(accountId), storage },
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        expiresAt,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );
  }
}

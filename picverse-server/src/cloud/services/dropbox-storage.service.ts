import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Dropbox, DropboxAuth, DropboxResponse } from "dropbox";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Model } from "mongoose";
import * as sharp from "sharp";

import { UploadFileDto, IExternalStorageService, ECloudStorage, EResourceType, CloudCredentials, Resource } from "../models";
import { ResourceService } from "./resource.service";
import { getExpiredTime } from "@common/utils";

@Injectable()
export class DropboxStorageService implements IExternalStorageService {
  private dropboxAuth: DropboxAuth;

  constructor(
    @InjectModel(CloudCredentials.name) private oauthCredentialsModel: Model<CloudCredentials>,
    private readonly resourceService: ResourceService,
    private readonly configService: ConfigService,
  ) {
    this.dropboxAuth = new DropboxAuth({
      clientId: this.configService.get<string>("DROPBOX_APP_KEY"),
      clientSecret: this.configService.get<string>("DROPBOX_APP_SECRET"),
    });
  }

  async getAuthUrl(accountId: DocumentId): Promise<string> {
    const state: string = Buffer.from(JSON.stringify({ accountId })).toString("base64");

    const authUrl = await this.dropboxAuth.getAuthenticationUrl(this.configService.get<string>("DROPBOX_CALLBACK_URL"), state, "code", "offline");

    return authUrl.toString();
  }

  async handleAuthCallback(code: string, state: string): Promise<CloudModule.StorageAuthCallbackResponse> {
    const decodedState: CloudModule.CloudAuthState = JSON.parse(Buffer.from(state, "base64").toString("utf8"));
    const response: DropboxResponse<object> = await this.dropboxAuth.getAccessTokenFromCode(this.configService.get<string>("DROPBOX_CALLBACK_URL"), code);

    return {
      accountId: decodedState.accountId,
      accessToken: response.result["access_token"],
      refreshToken: response.result["refresh_token"] || null,
      expiresIn: response.result["expires_in"] || 0,
    };
  }

  async refreshAuthToken(credentials: CloudCredentials): Promise<CloudModule.StorageRefreshTokenResponse> {
    const dropboxAuth: DropboxAuth = new DropboxAuth({
      clientId: this.configService.get<string>("DROPBOX_APP_KEY"),
      clientSecret: this.configService.get<string>("DROPBOX_APP_SECRET"),
      refreshToken: credentials.refreshToken,
    });

    await dropboxAuth.refreshAccessToken();

    const newAccessToken = dropboxAuth.getAccessToken();
    const newRefreshToken = dropboxAuth.getRefreshToken() || credentials.refreshToken;
    const expiresAt = dropboxAuth.getAccessTokenExpiresAt();

    if (!newAccessToken) {
      throw new Error("Failed to refresh Dropbox access token");
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: expiresAt ? Math.floor((expiresAt.getTime() - Date.now()) / 1000) : 0,
    };
  }

  async getValidAccessToken(accountId: DocumentId, storage: ECloudStorage): Promise<string> {
    const credentials = await this.oauthCredentialsModel.findOne({ accountId, storage });

    if (!credentials) {
      return null;
    }

    if (credentials.expiresAt && credentials.expiresAt > new Date()) {
      return credentials.accessToken;
    }

    const updates: CloudModule.StorageRefreshTokenResponse = await this.refreshAuthToken(credentials);

    await this.oauthCredentialsModel.updateOne(
      { _id: accountId },
      {
        ...updates,
        expiresAt: getExpiredTime(updates.expiresIn),
      },
    );

    return updates.accessToken;
  }

  private async getDropboxInstance(accountId: DocumentId): Promise<Dropbox> {
    const accessToken: string = await this.getValidAccessToken(accountId, ECloudStorage.DROPBOX);

    if (!accessToken) return null;

    return new Dropbox({ accessToken });
  }

  async getAvailableSpace(accountId: DocumentId): Promise<number> {
    const dropbox = await this.getDropboxInstance(accountId);
    const space = await dropbox.usersGetSpaceUsage();

    if (space.result.allocation[".tag"] === "individual" && "allocated" in space.result.allocation) {
      return space.result.allocation.allocated - space.result.used;
    }

    throw new Error("Unable to determine available space.");
  }

  async getTotalSpace(accountId: DocumentId): Promise<number> {
    const dropbox = await this.getDropboxInstance(accountId);
    const space = await dropbox.usersGetSpaceUsage();

    if (space.result.allocation[".tag"] === "individual" && "allocated" in space.result.allocation) {
      return space.result.allocation.allocated;
    }

    throw new Error("Unable to determine total space.");
  }

  async getFile(resource: Resource, width?: number, height?: number): Promise<Blob> {
    const dropbox = await this.getDropboxInstance(resource.accountId);

    if (!dropbox) {
      throw new BadRequestException("Please link Dropbox storage to continue.");
    }

    try {
      const fileResponse = (await dropbox.filesDownload({ path: resource.referenceId.toString() })) as any;

      if (!fileResponse.result.fileBinary) {
        throw new Error("No file data found.");
      }

      let buffer: Buffer;

      if (fileResponse.result.fileBinary instanceof ArrayBuffer) {
        buffer = Buffer.from(new Uint8Array(fileResponse.result.fileBinary));
      } else if (fileResponse.result.fileBinary instanceof Uint8Array) {
        buffer = Buffer.from(fileResponse.result.fileBinary);
      } else {
        throw new Error("Unsupported file format.");
      }

      if (width || height) {
        buffer = await sharp(buffer)
          .resize(width || undefined, height || undefined)
          .webp({ quality: 90 })
          .toBuffer();
      }

      return new Blob([buffer], { type: "image/webp" });
    } catch (error) {
      console.error("Error in getFile:", error.message);
      throw new NotFoundException("File not found in Dropbox.");
    }
  }

  async getFileStream(file: Resource, response: Response): Promise<void> {
    try {
      const dropbox: Dropbox = await this.getDropboxInstance(file.accountId);

      if (!dropbox) {
        throw new BadRequestException(`Please link ${file.storage} storage to continue`);
      }

      const fileResponse = (await dropbox.filesDownload({ path: file.id.toString() })) as any;

      if (!fileResponse.result.fileBinary) {
        throw new Error("No file data found.");
      }

      response.setHeader("Content-Type", "application/octet-stream");
      response.setHeader("Content-Disposition", `attachment; filename="${fileResponse.result.name}"`);
      response.setHeader("Content-Length", fileResponse.result.fileBinary.length.toString());

      response.send(fileResponse.result.fileBinary);
    } catch (error) {
      console.error("Error in getFileStream:", error.message);
      response.status(404).send("File not found.");
    }
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, payload: UploadFileDto): Promise<Resource> {
    const dropbox = await this.getDropboxInstance(accountId);
    const response = await dropbox.filesUpload({ path: `/picverse/${file.originalname}`, contents: file.buffer });

    const result = response.result;

    const createdResource: Resource = await this.resourceService.create({
      referenceId: result.id,
      name: file.originalname,
      parentId: payload.parentId,
      type: EResourceType.FILE,
      storage: ECloudStorage.DROPBOX,
      accountId,
      size: result.size,
      mimeType: file.mimetype,
    });

    return createdResource;
  }

  async deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean> {
    try {
      const dropbox = await this.getDropboxInstance(accountId);
      await dropbox.filesDeleteV2({ path: file.id.toString() });
      return true;
    } catch (error) {
      return false;
    }
  }

  async listFiles(accountId: DocumentId): Promise<Array<{ id: string; name: string; size: number | null }>> {
    const dropbox = await this.getDropboxInstance(accountId);
    const response = await dropbox.filesListFolder({ path: "" });

    return response.result.entries
      .filter((entry) => entry[".tag"] === "file")
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        size: entry.size || null,
      }));
  }
}

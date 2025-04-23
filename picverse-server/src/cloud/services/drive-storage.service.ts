import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Auth, drive_v3, google } from "googleapis";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Response } from "express";
import { Readable } from "stream";
import { Model } from "mongoose";
import * as sharp from "sharp";

import { UploadFileDto, IExternalStorageService, ECloudStorage, EResourceType, CloudCredentials, Resource } from "../models";
import { ResourceService } from "./resource.service";
import { getExpiredTime } from "@common/utils";
import { EOAuthScopes } from "@common/enums";

@Injectable()
export class DriveStorageService implements IExternalStorageService {
  private authClient: Auth.OAuth2Client;

  constructor(
    @InjectModel(CloudCredentials.name) private oauthCredentialsModel: Model<CloudCredentials>,
    private readonly resourceService: ResourceService,
    private readonly configService: ConfigService,
  ) {
    this.authClient = new google.auth.OAuth2(
      this.configService.get<string>("OAUTH_CLIENT_ID"),
      this.configService.get<string>("OAUTH_CLIENT_SECRET"),
      this.configService.get<string>("DRIVE_CALLBACK_URL"),
    );
  }

  getAuthUrl(accountId: DocumentId): string {
    const scopes = [EOAuthScopes.DRIVE, EOAuthScopes.USER_INFO_PROFILE];

    const state: string = Buffer.from(JSON.stringify({ accountId })).toString("base64");

    return this.authClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state,
    });
  }

  async handleAuthCallback(code: string, state: string): Promise<CloudModule.StorageAuthCallbackResponse> {
    const { tokens } = await this.authClient.getToken(code);
    const decodedState: CloudModule.CloudAuthState = JSON.parse(Buffer.from(state, "base64").toString("utf8"));

    return {
      accountId: decodedState.accountId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expiry_date,
    };
  }

  async refreshAuthToken(credentials: CloudCredentials): Promise<CloudModule.StorageRefreshTokenResponse> {
    const driveAuthClient: Auth.OAuth2Client = new google.auth.OAuth2(this.configService.get<string>("OAUTH_CLIENT_ID"), this.configService.get<string>("OAUTH_CLIENT_SECRET"));

    driveAuthClient.setCredentials({
      refresh_token: credentials.refreshToken,
    });

    const { credentials: newCredentials } = await driveAuthClient.refreshAccessToken();

    return {
      accessToken: newCredentials.access_token,
      refreshToken: newCredentials.refresh_token,
      expiresIn: newCredentials.expiry_date,
    };
  }

  private async getDriveInstance(accountId: DocumentId): Promise<drive_v3.Drive | null> {
    const accessToken = await this.getValidAccessToken(accountId, ECloudStorage.DRIVE);

    if (!accessToken) return null;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    return google.drive({ version: "v3", auth });
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
    await this.oauthCredentialsModel.updateOne(accountId, {
      ...updates,
      expiresAt: getExpiredTime(updates.expiresIn),
    });

    throw new Error("Unsupported provider");
  }

  async getAvailableSpace(accountId: DocumentId): Promise<number> {
    const drive = await this.getDriveInstance(accountId);
    const about = await drive.about.get({ fields: "storageQuota" });

    const limit = parseInt(about.data.storageQuota?.limit || "0", 10);
    const usage = parseInt(about.data.storageQuota?.usage || "0", 10);

    return limit - usage;
  }

  async getTotalSpace(accountId: DocumentId): Promise<number> {
    const drive = await this.getDriveInstance(accountId);
    const about = await drive.about.get({ fields: "storageQuota" });

    return parseInt(about.data.storageQuota?.limit || "0", 10);
  }

  async getFile(resource: Resource, width?: number, height?: number): Promise<Blob> {
    const drive = await this.getDriveInstance(resource.accountId);

    if (!drive) {
      throw new BadRequestException("Please link Google Drive storage to continue.");
    }

    try {
      const response = await drive.files.get(
        {
          fileId: resource.referenceId.toString(),
          alt: "media",
        },
        { responseType: "stream" },
      );

      const chunks: Buffer[] = [];
      for await (const chunk of response.data) {
        chunks.push(chunk);
      }

      let buffer: Buffer = Buffer.concat(chunks);
      const contentType = response.headers["content-type"] || "application/octet-stream";

      if (width || height) {
        buffer = await sharp(buffer)
          .resize(width || undefined, height || undefined)
          .webp({ quality: 90 })
          .toBuffer();
      }

      return new Blob([buffer], { type: contentType });
    } catch (error) {
      console.error(error);
      throw new NotFoundException("File not found in Google Drive.");
    }
  }

  async getFileStream(resource: Resource, response: Response): Promise<void> {
    try {
      const drive = await this.getDriveInstance(resource.accountId);

      if (!drive) throw new BadRequestException(`Please link drive storage to continue`);

      const downloadStream = await drive.files.get(
        {
          fileId: resource.referenceId.toString(),
          alt: "media",
        },
        { responseType: "stream" },
      );

      response.setHeader("Content-Type", downloadStream.headers["content-type"] || "application/octet-stream");
      response.setHeader("Content-Disposition", `attachment; filename="${resource.name}"`);

      downloadStream.data
        .on("error", (error) => {
          console.error(error);
          response.status(500).send("Error downloading file.");
        })
        .pipe(response);
    } catch (error) {
      console.error(error);
      response.status(404).send("File not found.");
    }
  }

  async uploadFile(accountId: DocumentId, file: Express.Multer.File, payload: UploadFileDto): Promise<Resource> {
    const drive = await this.getDriveInstance(accountId);

    if (!drive) throw new BadRequestException(`Please link drive storage to continue`);

    const folderName = "picverse";
    let folderId: string | null = null;

    const folderResponse = await drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`,
      fields: "files(id, name)",
    });

    const existingFolder = folderResponse.data.files?.find((file) => file.name === folderName);

    if (existingFolder) {
      folderId = existingFolder.id;
    } else {
      const folderMetadata = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        },
      });
      folderId = folderMetadata.data.id;
    }

    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: "application/octet-stream",
        parents: [folderId],
      },
      media: {
        mimeType: "application/octet-stream",
        body: fileStream,
      },
    });

    const result = response.data;

    const createdResource: Resource = await this.resourceService.create({
      referenceId: result.id,
      name: file.originalname,
      parentId: payload.parentId,
      type: EResourceType.FILE,
      storage: ECloudStorage.DRIVE,
      accountId,
      size: result.size,
      mimeType: file.mimetype,
    });

    return createdResource;
  }

  async deleteFile(accountId: DocumentId, file: Resource | DocumentId): Promise<boolean> {
    try {
      const drive = await this.getDriveInstance(accountId);
      await drive.files.delete({ fileId: file.id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async listFiles(accountId: DocumentId): Promise<Array<{ id: string; name: string; size: number | null }>> {
    const drive = await this.getDriveInstance(accountId);
    const response = await drive.files.list({
      fields: "files(id, name, size)",
    });

    return (response.data.files || []).map((file) => ({
      id: file.id || "",
      name: file.name || "",
      size: file.size ? parseInt(file.size, 10) : null,
    }));
  }
}

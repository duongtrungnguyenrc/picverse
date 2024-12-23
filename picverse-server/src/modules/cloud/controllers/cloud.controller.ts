import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Param, Query, Get, Res, UseInterceptors, Post, Body, UploadedFile, Delete, Put } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { ApiPagination, Auth, AuthUid, Pagination } from "@common/decorators";
import { CreateFolderDto, UpdateFolderDto, UploadFileDto } from "../dtos";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { CloudService } from "../services";
import { ECloudStorage } from "../enums";
import { Resource } from "../schemas";

@Controller("cloud")
@ApiTags("Cloud")
export class CloudStorageController {
  constructor(private readonly cloudService: CloudService) {}

  @Auth()
  @Get("/storage/link")
  @ApiOperation({ summary: "Link external cloud storage" })
  @ApiQuery({ name: "storage", description: "Supported external storage provider name (drive, dropbox,...)" })
  async linkExternalStorage(@AuthUid() accountId: DocumentId, @Query("storage") storage: ECloudStorage, @Res() res: Response) {
    const url: string = await this.cloudService.getExternalStorageAuthUrl(accountId, storage);
    console.log(url);

    res.redirect(url);
  }

  @Auth()
  @Delete("/storage/unlink:storage")
  @ApiOperation({ summary: "Link external cloud storage" })
  @ApiParam({ name: "storage", description: "Storage name" })
  @ApiOkResponse({ type: StatusResponseDto })
  async unlinkExternalStorage(@AuthUid() accountId: DocumentId, @Param("storage") storage: ECloudStorage) {
    return this.unlinkExternalStorage(accountId, storage);
  }

  @Get("/webhooks/:storage-callback")
  @ApiOperation({ summary: "External cloud storage auth callback" })
  @ApiOkResponse({ type: StatusResponseDto })
  async driveAuthCallback(@Query("code") code: string, @Param("storage") storage: ECloudStorage, @Query("state") state: string): Promise<StatusResponseDto> {
    return await this.cloudService.handleExternalStorageCallback(code, state, storage);
  }

  @Auth()
  @Post("/folder")
  @ApiOperation({ summary: "Create folder" })
  @ApiBody({ type: CreateFolderDto })
  @ApiCreatedResponse({ type: StatusResponseDto })
  async createFolder(@AuthUid() accountId: DocumentId, @Body() payload: CreateFolderDto): Promise<StatusResponseDto> {
    return await this.cloudService.createFolder(accountId, payload);
  }

  @Get("/resources")
  @ApiOperation({ summary: "Get folder items" })
  @ApiPagination()
  @ApiQuery({ name: "folderId", required: false, description: "Parent folder id" })
  @ApiOkResponse({ type: InfiniteResponse<Resource> })
  async getFolderItems(
    @AuthUid() accountId: DocumentId,
    @Query("folderId") folderId: DocumentId | undefined,
    @Pagination() pagination: Pagination,
  ): Promise<InfiniteResponse<Resource>> {
    return await this.cloudService.getResources(accountId, folderId, pagination);
  }

  @Auth()
  @Delete("/folder/:folderId")
  @ApiOperation({ summary: "Delete folder" })
  @ApiParam({ description: "Folder id", name: "folderId" })
  async deleteFolder(@AuthUid() accountId: DocumentId, @Param("folderId") folderId: DocumentId): Promise<StatusResponseDto> {
    return await this.cloudService.deleteFolder(accountId, folderId);
  }

  @Auth()
  @Put("/folder/:folderId")
  @ApiOperation({ summary: "Update folder" })
  @ApiParam({ description: "Folder id", name: "folderId" })
  @ApiBody({ type: UpdateFolderDto })
  @ApiOkResponse({ type: StatusResponseDto })
  async updateFolder(@AuthUid() accountId: DocumentId, @Param("folderId") folderId: DocumentId, @Body() payload: UpdateFolderDto): Promise<StatusResponseDto> {
    return await this.cloudService.updateFolder(accountId, folderId, payload);
  }

  @Auth()
  @Post("/file")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file to cloud" })
  @ApiConsumes("multipart/form-data")
  @ApiQuery({ description: "Storage provider" })
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: StatusResponseDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @AuthUid() accountId: DocumentId,
    @Query("storage") storage: ECloudStorage = ECloudStorage.LOCAL,
    @Body() payload: UploadFileDto,
  ): Promise<StatusResponseDto> {
    return await this.cloudService.uploadFile(accountId, file, storage, payload);
  }

  @Get("/file/:fileId")
  @ApiOperation({ summary: "Get file" })
  async getFile(@AuthUid() accountId: DocumentId, @Param("fileId") fileId: DocumentId, @Res() res: Response): Promise<void> {
    await this.cloudService.getFile(accountId, fileId, res);
  }

  @Auth()
  @Delete("/file/:fileId")
  @ApiOperation({ summary: "Delete file" })
  async deleteFile(@AuthUid() accountId: DocumentId, @Param("fileId") fileId: DocumentId) {
    await this.cloudService.deleteFile(accountId, fileId);
  }

  @Auth()
  @Get("/usage")
  @ApiOperation({ summary: "Get cloud usage statistic" })
  async getUsageStatus() {}
}

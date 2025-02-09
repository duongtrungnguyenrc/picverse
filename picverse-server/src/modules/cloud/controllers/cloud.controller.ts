import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Controller, Param, Query, Get, Res, UseInterceptors, Post, Body, UploadedFile, Delete, Put } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { ApiPagination, Auth, AuthUid, Pagination } from "@common/decorators";
import { CreateFolderDto, UpdateResourceDto, UploadFileDto } from "../models";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { CloudService } from "../services";
import { ECloudStorage } from "../enums";
import { Resource } from "../models";

@Controller("cloud")
@ApiTags("Cloud")
export class CloudStorageController {
  constructor(private readonly cloudService: CloudService) {}

  @Auth()
  @Post("/storage/link")
  @ApiOperation({ summary: "Link external cloud storage" })
  @ApiQuery({ name: "storage", description: "Supported external storage provider name (drive, dropbox,...)" })
  async linkExternalStorage(@AuthUid() accountId: DocumentId, @Query("storage") storage: ECloudStorage) {
    return await this.cloudService.getExternalStorageAuthUrl(accountId, storage);
  }

  @Auth()
  @Get("/storage/link/status")
  @ApiOperation({ summary: "Get storage link status" })
  async getStorageLinkStatus(@AuthUid() accountId: DocumentId) {
    return await this.cloudService.getStorageLinkStatus(accountId);
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
  async driveAuthCallback(@Query("code") code: string, @Param("storage") storage: ECloudStorage, @Query("state") state: string, @Res() response: Response): Promise<void> {
    return await this.cloudService.handleExternalStorageCallback(code, state, storage, response);
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
  @ApiQuery({ name: "parentId", required: false, description: "Parent folder id" })
  @ApiOkResponse({ type: InfiniteResponse<Resource> })
  async getFolderItems(
    @AuthUid() accountId: DocumentId,
    @Query("parentId") parentId: DocumentId | undefined,
    @Pagination() pagination: Pagination,
  ): Promise<InfiniteResponse<Resource>> {
    return await this.cloudService.getResources(accountId, parentId, pagination);
  }

  @Auth()
  @Delete("/folder/:parentId")
  @ApiOperation({ summary: "Delete folder" })
  @ApiParam({ description: "Folder id", name: "parentId" })
  async deleteFolder(@AuthUid() accountId: DocumentId, @Param("parentId") parentId: DocumentId): Promise<StatusResponseDto> {
    return await this.cloudService.deleteFolder(accountId, parentId);
  }

  @Auth()
  @Put("/resource/:resourceId")
  @ApiOperation({ summary: "Update resource" })
  @ApiParam({ description: "Resource id", name: "resourceId" })
  @ApiBody({ type: UpdateResourceDto })
  @ApiOkResponse({ type: StatusResponseDto })
  async updateResource(@AuthUid() accountId: DocumentId, @Param("resourceId") resourceId: DocumentId, @Body() payload: UpdateResourceDto): Promise<StatusResponseDto> {
    return await this.cloudService.updateResource(accountId, resourceId, payload);
  }

  @Auth()
  @Post("/file")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file to cloud" })
  @ApiQuery({ name: "parentId", required: false, description: "Parent folder id" })
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: StatusResponseDto })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @AuthUid() accountId: DocumentId,
    @Query("parentId") parentId: DocumentId,
    @Body() payload: UploadFileDto,
  ): Promise<StatusResponseDto> {
    return await this.cloudService.uploadFile(accountId, parentId, file, payload);
  }

  @Get("/file/:fileId")
  @ApiOperation({ summary: "Get file" })
  async getFile(@Param("fileId") fileId: DocumentId, @Res() response: Response): Promise<void> {
    await this.cloudService.getFile(fileId, response);
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

import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { CreatePinDto, UpdatePinDto, PinDetailDto, Pin, CommentDetailDto } from "../models";
import { ApiPagination, Auth, AuthUid, Pagination } from "@common/decorators";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { PinService } from "../services";

@Controller("/pin")
@ApiTags("Pin")
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Auth()
  @Post("/")
  @ApiOperation({ summary: "Create a new pin" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreatePinDto })
  @ApiCreatedResponse({ description: "Pin created, return status", type: StatusResponseDto })
  async createPin(@AuthUid() accountId: DocumentId, @UploadedFile() file: Express.Multer.File, @Body() payload: CreatePinDto): Promise<StatusResponseDto> {
    return await this.pinService.createPin(accountId, file, payload);
  }

  @Put("/:pinId")
  @ApiOperation({ summary: "Update pin" })
  @ApiBody({ type: UpdatePinDto })
  @ApiOkResponse({ description: "Pin updated, return status", type: StatusResponseDto })
  async updatePin(@AuthUid() accountId: DocumentId, @Param("pinId") pinId: DocumentId, @Body() payload: CreatePinDto): Promise<StatusResponseDto> {
    return await this.pinService.updatePin(accountId, pinId, payload);
  }

  @Delete("/:pinId")
  @ApiOperation({ summary: "Delete a pin" })
  @ApiOkResponse({ description: "Pin deleted, return status", type: StatusResponseDto })
  async deletePin(@AuthUid() accountId: DocumentId, @Param("pinId") pinId: DocumentId): Promise<StatusResponseDto> {
    return await this.pinService.deletePin(accountId, pinId);
  }

  @Get("/")
  @ApiOperation({ summary: "Get all pins" })
  @ApiOkResponse({ description: "Returns all pins of the user", type: [Pin] })
  async getAllPins(@AuthUid() accountId: DocumentId): Promise<Pin[]> {
    return await this.pinService.getAllPins(accountId);
  }

  @Get("/:pinId")
  @ApiOperation({ summary: "Get pin detail" })
  @ApiParam({ name: "pinId", description: "Pin id" })
  @ApiOkResponse({ description: "Returns pin detail", type: PinDetailDto })
  async getPinDetail(@Param("pinId") pinId: DocumentId, @AuthUid() accountId?: DocumentId): Promise<PinDetailDto> {
    return await this.pinService.getPinDetail(pinId, accountId);
  }

  @Get("/similar/:pinId")
  @ApiPagination()
  @ApiOkResponse({ type: InfiniteResponse<Pin> })
  async getSimilarPins(@Param("pinId") pinId: DocumentId, @Pagination() pagination: Pagination): Promise<InfiniteResponse<Pin>> {
    return this.pinService.getSimilarPins(pinId, pagination);
  }

  @Get("/:pinId/comments")
  @ApiPagination()
  @ApiOperation({ summary: "Get pin comments" })
  @ApiParam({ name: "pinId", description: "Pin id" })
  @ApiOkResponse({ description: "Returns all pin comments", type: InfiniteResponse<CommentDetailDto> })
  async getPinComments(@Param("pinId") pinId: DocumentId, @Pagination() pagination: Pagination): Promise<InfiniteResponse<CommentDetailDto>> {
    return await this.pinService.getPinComments(pinId, pagination);
  }
}

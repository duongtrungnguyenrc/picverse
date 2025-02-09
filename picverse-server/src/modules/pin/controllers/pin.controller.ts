import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { AuthTokenPayload } from "@common/decorators";
import { CreatePinDto, UpdatePinDto } from "../models";
import { StatusResponseDto } from "@common/dtos";
import { PinService } from "../services";
import { Pin } from "../models";

@Controller("/pin")
@ApiTags("Pin")
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post("/")
  @ApiOperation({ summary: "Create a new pin" })
  @ApiBody({ type: CreatePinDto })
  @ApiCreatedResponse({ description: "Pin created, return status", type: StatusResponseDto })
  async createPin(@AuthTokenPayload("pid") profileId: DocumentId, @Body() payload: CreatePinDto): Promise<StatusResponseDto> {
    return await this.pinService.createPin(profileId, payload);
  }

  @Put("/:pinId")
  @ApiOperation({ summary: "Update pin" })
  @ApiBody({ type: UpdatePinDto })
  @ApiOkResponse({ description: "Pin updated, return status", type: StatusResponseDto })
  async updatePin(@AuthTokenPayload("pid") profileId: DocumentId, @Param("pinId") pinId: DocumentId, @Body() payload: CreatePinDto): Promise<StatusResponseDto> {
    return await this.pinService.updatePin(profileId, pinId, payload);
  }

  @Delete("/:pinId")
  @ApiOperation({ summary: "Delete a pin" })
  @ApiOkResponse({ description: "Pin deleted, return status", type: StatusResponseDto })
  async deletePin(@AuthTokenPayload("pid") profileId: DocumentId, @Param("pinId") pinId: DocumentId): Promise<StatusResponseDto> {
    return await this.pinService.deletePin(profileId, pinId);
  }

  @Get("/")
  @ApiOperation({ summary: "Get all pins" })
  @ApiOkResponse({ description: "Returns all pins of the user", type: [Pin] })
  async getAllPins(@AuthTokenPayload("pid") profileId: DocumentId): Promise<Pin[]> {
    return await this.pinService.getAllPins(profileId);
  }
}

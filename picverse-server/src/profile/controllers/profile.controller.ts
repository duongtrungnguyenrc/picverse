import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Put, Query } from "@nestjs/common";

import { ProfileDetailDto, UpdateProfileDto } from "../models";
import { Auth, AuthUid } from "@common/decorators";
import { StatusResponseDto } from "@common/dtos";
import { ProfileService } from "../services";

@Controller("profile")
@ApiTags("Profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Auth()
  @Put("/")
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: "Profile updated success. Return status", type: StatusResponseDto })
  async updateProfile(@AuthUid() accountId: DocumentId, @Body() payload: UpdateProfileDto): Promise<StatusResponseDto> {
    await this.profileService.update({ account: accountId }, payload);
    return { message: "Profile updated success" };
  }

  @Get("/")
  @ApiQuery({ name: "id", description: "Profile id", required: false })
  @ApiOperation({ summary: "Get profile detail" })
  @ApiResponse({ status: 200, description: "Get profile success. Return profile", type: ProfileDetailDto })
  async getProfile(@Query("id") targetAccountId?: DocumentId, @AuthUid() accountId?: DocumentId): Promise<ProfileDetailDto> {
    return await this.profileService.getProfileDetail(targetAccountId ? targetAccountId : accountId);
  }
}

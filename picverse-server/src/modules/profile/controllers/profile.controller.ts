import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Put } from "@nestjs/common";

import { Auth, AuthUid } from "@common/decorators";
import { EProfileApiDescription } from "../enums";
import { ProfileService } from "../services";
import { UpdateProfileDto } from "../dtos";
import { Profile } from "../schemas";

@Controller("profile")
@ApiTags("Profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Auth()
  @Put("/")
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: EProfileApiDescription.UPDATE_PROFILE_SUCCESS, type: Boolean })
  async updateProfile(@AuthUid() accountId: DocumentId, @Body() payload: UpdateProfileDto): Promise<boolean> {
    return !!(await this.profileService.update(accountId, payload));
  }

  @Auth()
  @Get("/")
  @ApiResponse({ status: 200, description: EProfileApiDescription.GET_AUTH_PROFILE_SUCCESS, type: Profile })
  async getAuthProfile(@AuthUid() accountId: DocumentId): Promise<Profile> {
    return await this.profileService.find({ account: accountId });
  }

  @Get("/:id")
  @ApiParam({ name: "id" })
  @ApiResponse({ status: 200, description: EProfileApiDescription.GET_AUTH_PROFILE_SUCCESS, type: Profile })
  async getProfile(@Param("id") profileId: DocumentId): Promise<Profile> {
    return await this.profileService.find({ _id: profileId, isPublic: true });
  }
}

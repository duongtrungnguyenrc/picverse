import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Put } from "@nestjs/common";

import { Auth, AuthUid } from "@common/decorators";
import { ProfileService } from "../services";
import { UpdateProfileDto } from "../dtos";
import { Profile } from "../schemas";

@Controller("profiles")
@ApiTags("Profiles")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Auth()
  @Put("/")
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: "Profile updated success. Return status", type: Boolean })
  async updateProfile(@AuthUid() accountId: DocumentId, @Body() payload: UpdateProfileDto): Promise<boolean> {
    return !!(await this.profileService.update({ account: accountId }, payload));
  }

  @Auth()
  @Get("/")
  @ApiResponse({ status: 200, description: "Get auth profile success. Return auth profile", type: Profile })
  async getAuthProfile(@AuthUid() accountId: DocumentId): Promise<Profile> {
    return await this.profileService.find({ account: accountId });
  }

  @Get("/:id")
  @ApiParam({ name: "id" })
  @ApiResponse({ status: 200, description: "Get profile success. Return profile", type: Profile })
  async getProfile(@Param("id") profileId: DocumentId): Promise<Profile> {
    return await this.profileService.find({ _id: profileId, isPublic: true });
  }
}

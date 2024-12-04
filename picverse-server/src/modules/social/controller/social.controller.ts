import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { FollowService, NotificationService } from "../services";
import { Auth, AuthUid, Pagination } from "@common/decorators";
import { IdParamDto, InfiniteResponse } from "@common/dtos";
import { Follow, Notification } from "../schemas";

@Controller("social")
@ApiTags("Social")
export class SocialController {
  constructor(
    private readonly followService: FollowService,
    private readonly notificationService: NotificationService,
  ) {}

  @Auth()
  @Post("/follows/:id")
  @ApiParam({ name: "id" })
  @ApiCreatedResponse({ description: "Follow profile success. Return new follow" })
  async createFollow(@AuthUid() accountId: DocumentId, @Param() params: IdParamDto): Promise<Follow> {
    return this.followService.createFollow(accountId, params.id);
  }

  @Auth()
  @Delete("/follows/:id")
  @ApiParam({ name: "id" })
  @ApiOkResponse({ description: "Unfollow profile success. Return status", type: Boolean })
  async unfollow(@AuthUid() accountId: DocumentId, @Param() params: IdParamDto): Promise<boolean> {
    return this.followService.unfollow(accountId, params.id);
  }

  @Auth()
  @Get("/notifications")
  @ApiOkResponse({ description: "Load notifications success. Return infinite notifications", type: InfiniteResponse<Notification> })
  async loadNotifications(@AuthUid() accountId: DocumentId, @Pagination() pagination: Pagination): Promise<InfiniteResponse<Notification>> {
    return await this.notificationService.findMultipleInfinite({ account: accountId }, pagination);
  }
}

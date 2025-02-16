import { Controller, Get } from "@nestjs/common";

import { ApiPagination, AuthUid, Pagination } from "@common/decorators";
import { InfiniteResponse } from "@common/dtos";
import { FeedService } from "../services";
import { Pin } from "@modules/pin";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@Controller("feed")
@ApiTags("Feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get("/")
  @ApiPagination()
  @ApiOkResponse({ type: InfiniteResponse<Pin> })
  loadFeed(@Pagination() pagination: Pagination, @AuthUid() accountId?: DocumentId): Promise<InfiniteResponse<Pin>> {
    return this.feedService.loadFeed(pagination, accountId);
  }
}

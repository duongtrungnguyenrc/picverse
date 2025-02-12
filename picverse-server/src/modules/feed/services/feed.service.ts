import { Injectable } from "@nestjs/common";

import { FollowService } from "@modules/social";
import { PinService } from "@modules/pin";

@Injectable()
export class FeedService {
  constructor(
    private readonly pinService: PinService,
    private readonly followService: FollowService,
  ) {}

  async loadFeed(pagination: Pagination, accountId?: DocumentId) {
    let filter = {};

    if (accountId) {
      const followUsers = await this.followService.findMultiple({ follower: accountId });
      const followingIds = followUsers.map((user) => user.following);

      filter = { accountId: { $in: followingIds } };
    } else {
      filter = {};
    }

    try {
      return await this.pinService.findMultipleInfinite(filter, pagination, {
        populate: ["tags"],
        sort: { createdAt: -1 },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

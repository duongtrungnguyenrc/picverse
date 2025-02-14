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
    let filter: any = { isPublic: true };

    // if (accountId) {
    //   const followUsers = await this.followService.findMultiple({ follower: accountId });
    //   const followingIds = followUsers.map((user) => user.following);

    //   filter = { ...filter, accountId: { $in: followingIds } };
    // }

    try {
      return await this.pinService.findMultipleInfinite(filter, pagination, {
        select: ["_id", "resource"],
        sort: { createdAt: -1 },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

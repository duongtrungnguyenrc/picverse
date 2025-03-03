import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Profile, ProfileDetailDto } from "../models";
import { AccountService } from "@modules/account";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { FollowService } from "@modules/social";

@Injectable()
export class ProfileService extends Repository<Profile> {
  constructor(
    @InjectModel(Profile.name) ProfileModel: Model<Profile>,
    cacheService: CacheService,
    @Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
    @Inject(forwardRef(() => FollowService)) private readonly followService: FollowService,
  ) {
    super(ProfileModel, cacheService);
  }

  async getProfileDetail(type: "own" | "other", accountId: DocumentId, targetAccountId?: DocumentId): Promise<ProfileDetailDto> {
    const id = type === "own" ? accountId : targetAccountId;

    const account = await this.accountService.find(
      {
        _id: id,
        isActive: true,
      },
      { select: ["email", "inboxCofig"], force: true },
    );

    if (!account) throw new NotFoundException("Profile not found");

    let isFollowed = false;

    const profile = await this.find({ accountId: id, isPublic: true }, { select: ["-accountId"], force: true });

    if (accountId && targetAccountId) {
      isFollowed = !!(await this.followService.exists({
        followerId: new Types.ObjectId(accountId),
        followingId: new Types.ObjectId(targetAccountId),
      }));
    }

    if (!profile) throw new NotFoundException("Profile not found");

    return {
      ...account,
      ...profile,
      isFollowed,
    };
  }
}

import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";

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

  async getProfileDetail(type: "own" | "other", accountId?: DocumentId, targetSignature?: DocumentId | string): Promise<ProfileDetailDto> {
    const isOwnProfile = type === "own";

    const accountQuery = this.accountService.find(accountId, {
      select: ["_id", "email", "inboxConfig"],
    });

    let targetAccountQuery: Promise<any> | null = null;

    if (!isOwnProfile) {
      targetAccountQuery = this.accountService.find(
        {
          $or: [{ userName: targetSignature }, { _id: isValidObjectId(targetSignature) ? new Types.ObjectId(targetSignature) : new Types.ObjectId() }],
          isActive: true,
        },
        { select: ["_id", "email", "inboxConfig"] },
      );
    }

    const [account, targetAccount] = await Promise.all([accountQuery, targetAccountQuery]);

    if ((isOwnProfile && !account) || (!isOwnProfile && !targetAccount)) throw new NotFoundException("Profile not foundd");

    const profile = await this.find({ accountId: isOwnProfile ? account._id : targetAccount._id, isPublic: true });

    if (!profile) throw new NotFoundException("Profile not found");
    let isFollowed = false;

    if (!isOwnProfile) {
      isFollowed = !!(await this.followService.exists({
        followerId: account._id,
        followingId: targetAccount._id,
      }));
    }

    return {
      ...(isOwnProfile ? account : targetAccount),
      ...profile,
      accountId: isOwnProfile ? account._id : targetAccount._id,
      isFollowed,
      isOwnProfile,
    };
  }
}

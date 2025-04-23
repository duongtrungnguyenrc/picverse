import { BadGatewayException, BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ENotificationType, SocialErrorMessages, Follow } from "../models";
import { NotificationService } from "./notification.service";
import { Profile, ProfileService } from "@modules/profile";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class FollowService extends Repository<Follow> {
  constructor(
    @InjectModel(Follow.name) FollowModel: Model<Follow>,
    cacheService: CacheService,
    @Inject(forwardRef(() => ProfileService)) private readonly profileService: ProfileService,
    private readonly notificationService: NotificationService,
  ) {
    super(FollowModel, cacheService);
  }

  async createFollow(accountId: DocumentId, targetProfileId: DocumentId): Promise<Follow> {
    const profile: Profile = await this.profileService.find(
      { account: accountId },
      {
        select: ["_id", "firstName", "lastName"],
      },
    );

    if (!profile) throw new BadRequestException(SocialErrorMessages.PROFILE_NOT_FOUND);

    const existedFollow: Follow = await this.find({ follower: profile._id, following: targetProfileId });

    if (existedFollow) throw new BadGatewayException(SocialErrorMessages.ALREADY_FOLLOw);

    const createdFollow: Follow = await this.create({ followerId: profile._id, followingId: targetProfileId });

    this.notificationService.sendNotification({
      to: accountId,
      from: profile._id,
      type: ENotificationType.NEW_FOLLOW,
      message: `${profile.firstName} ${profile.lastName} started follow you`,
    });

    return createdFollow;
  }

  async unfollow(accountId: DocumentId, targetProfileId: DocumentId): Promise<boolean> {
    const profile: Profile = await this.profileService.find(
      { account: accountId },
      {
        select: ["_id", "firstName", "lastName"],
      },
    );

    if (!profile) throw new BadRequestException(SocialErrorMessages.PROFILE_NOT_FOUND);

    return await this.delete({ follower: profile._id, following: targetProfileId });
  }
}

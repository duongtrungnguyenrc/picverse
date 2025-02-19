import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Profile, ProfileDetailDto } from "../models";
import { AccountService } from "@modules/account";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class ProfileService extends Repository<Profile> {
  constructor(
    @InjectModel(Profile.name) ProfileModel: Model<Profile>,
    cacheService: CacheService,
    @Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
  ) {
    super(ProfileModel, cacheService);
  }

  async getProfileDetail(accountId: DocumentId): Promise<ProfileDetailDto> {

    const account = await this.accountService.find(accountId, { select: ["email"], force: true });

    if (!account) throw new NotFoundException("Profile not found");

    const profile = await this.find({ accountId: new Types.ObjectId(accountId) }, { select: ["-accountId"] });

    if (!profile) throw new NotFoundException("Profile not found");

    return {
      email: account.email,
      ...profile,
    };
  }
}

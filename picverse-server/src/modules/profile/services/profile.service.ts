import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Profile } from "../models";

@Injectable()
export class ProfileService extends Repository<Profile> {
  constructor(@InjectModel(Profile.name) ProfileModel: Model<Profile>, cacheService: CacheService) {
    super(ProfileModel, cacheService);
  }
}

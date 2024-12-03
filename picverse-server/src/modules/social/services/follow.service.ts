import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Follow } from "../schemas";

@Injectable()
export class FollowService extends Repository<Follow> {
  constructor(@InjectModel(Follow.name) FollowModel: Model<Follow>, cacheService: CacheService) {
    super(FollowModel, cacheService);
  }
}

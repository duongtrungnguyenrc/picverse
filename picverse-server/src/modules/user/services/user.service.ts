import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { User } from "../schemas";

@Injectable()
export class UserService extends Repository<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>, cacheService: CacheService) {
    super(userModel, cacheService);
  }
}

import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Resource } from "../models";

@Injectable()
export class ResourceService extends Repository<Resource> {
  constructor(@InjectModel(Resource.name) resourceModel: Model<Resource>, cacheService: CacheService) {
    super(resourceModel, cacheService);
  }
}

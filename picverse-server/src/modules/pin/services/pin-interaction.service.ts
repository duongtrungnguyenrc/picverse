import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { PinInteraction } from "../models";

@Injectable()
export class PinInteractionService extends Repository<PinInteraction> {
  constructor(@InjectModel(PinInteraction.name) commentModel: Model<PinInteraction>, cacheService: CacheService) {
    super(commentModel, cacheService);
  }
}

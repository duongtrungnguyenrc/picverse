import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Conversation } from "../schemas";

@Injectable()
export class ConversationService extends Repository<Conversation> {
  constructor(@InjectModel(Conversation.name) messageModel: Model<Conversation>, cacheService: CacheService) {
    super(messageModel, cacheService);
  }
}

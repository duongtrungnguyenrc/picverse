import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Message } from "../schemas";

@Injectable()
export class ChatService extends Repository<Message> {
  constructor(@InjectModel(Message.name) messageModel: Model<Message>, cacheService: CacheService) {
    super(messageModel, cacheService);
  }
}

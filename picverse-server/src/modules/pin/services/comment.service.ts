import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Comment } from "../models";

@Injectable()
export class CommentService extends Repository<Comment> {
  constructor(@InjectModel(Comment.name) commentModel: Model<Comment>, cacheService: CacheService) {
    super(commentModel, cacheService);
  }
}

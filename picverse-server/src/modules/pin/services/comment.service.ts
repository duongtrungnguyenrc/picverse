import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { TextModerationService } from "@modules/moderation";
import { Comment, CreatePinCommentDto } from "../models";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class CommentService extends Repository<Comment> {
  constructor(
    @InjectModel(Comment.name) commentModel: Model<Comment>,
    cacheService: CacheService,
    private readonly textModerationService: TextModerationService,
  ) {
    super(commentModel, cacheService);
  }

  async createComment(accountId: DocumentId, payload: CreatePinCommentDto) {
    const moderationResult = await this.textModerationService.moderateContent(payload.content);

    if (moderationResult) {
      throw new Error(`${moderationResult.join(", ")} comment is not allowed`);
    }

    return this.create({
      accountId,
      ...payload,
    });
  }
}

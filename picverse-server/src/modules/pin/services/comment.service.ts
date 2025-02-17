import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { TextModerationService } from "@modules/moderation";
import { Comment, CreatePinCommentDto, EInteractionType } from "../models";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { PinInteractionService } from "./pin-interaction.service";

@Injectable()
export class CommentService extends Repository<Comment> {
  constructor(
    @InjectModel(Comment.name) commentModel: Model<Comment>,
    cacheService: CacheService,
    private readonly textModerationService: TextModerationService,
    private readonly pinInteractionService: PinInteractionService,
  ) {
    super(commentModel, cacheService);
  }

  async createComment(accountId: DocumentId, payload: CreatePinCommentDto) {
    const moderationResult = await this.textModerationService.moderateContent(payload.content);

    if (moderationResult) {
      throw new Error(`${moderationResult.join(", ")} comment is not allowed`);
    }

    return await this.create({
      accountId,
      ...payload,
    }).then((res) => {
      this.pinInteractionService.createInteraction({
        accountId,
        pinId: payload.pinId,
        type: EInteractionType.COMMENT,
      });
      return res;
    });
  }
}

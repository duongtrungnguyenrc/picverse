import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { FilterQuery, Model, PipelineStage } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Comment, CommentDetailDto, CreatePinCommentDto, EInteractionType } from "../models";
import { PinInteractionService } from "./pin-interaction.service";
import { TextModerationService } from "@modules/moderation";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class CommentService extends Repository<Comment> {
  constructor(
    @InjectModel(Comment.name) commentModel: Model<Comment>,
    cacheService: CacheService,
    private readonly textModerationService: TextModerationService,
    @Inject(forwardRef(() => PinInteractionService)) private readonly pinInteractionService: PinInteractionService,
  ) {
    super(commentModel, cacheService);
  }

  async createComment(accountId: DocumentId, payload: CreatePinCommentDto): Promise<CommentDetailDto> {
    const moderationResult = await this.textModerationService.moderateContent(payload.content);

    if (moderationResult) {
      throw new Error(`${moderationResult.join(", ")} comment is not allowed`);
    }

    const createdComment = await this.create({
      accountId,
      ...payload,
    });

    this.pinInteractionService.createInteraction({
      accountId,
      pinId: payload.pinId,
      type: EInteractionType.COMMENT,
    });

    const [comment] = await this.aggregate<CommentDetailDto>(this.getPinCommentDetailPipelineStages({ _id: createdComment._id }));

    return comment;
  }

  getPinCommentDetailPipelineStages(query: FilterQuery<Comment>): Array<PipelineStage> {
    return [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "profiles",
          let: { accountId: "$accountId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$accountId", { $toObjectId: "$$accountId" }] } } },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                avatar: 1,
              },
            },
          ],
          as: "by",
        },
      },
      {
        $project: {
          accountId: 0,
        },
      },
      { $unwind: { path: "$by", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
    ];
  }
}

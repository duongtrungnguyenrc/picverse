import { NotAcceptableException, Injectable, NotFoundException } from "@nestjs/common";
import { multerToBlobUrl, Repository } from "@common/utils";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { randomUUID } from "crypto";

import { CreatePinDto, UpdatePinDto, PinDetailDto, Pin, CommentDetailDto } from "../models";
import { ImageModerationService, TextModerationService } from "@modules/moderation";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { CloudService, Resource } from "@modules/cloud";
import { CommentService } from "./comment.service";
import { VectorService } from "@modules/vector";
import { CacheService } from "@modules/cache";

@Injectable()
export class PinService extends Repository<Pin> {
  constructor(
    @InjectModel(Pin.name) pinModel: Model<Pin>,
    cacheService: CacheService,
    private readonly cloudService: CloudService,
    private readonly vectorService: VectorService,
    private readonly imageModerationService: ImageModerationService,
    private readonly textModerationService: TextModerationService,
    private readonly commentService: CommentService,
  ) {
    super(pinModel, cacheService, Pin.name);
  }

  async createPin(accountId: DocumentId, file: Express.Multer.File, payload: CreatePinDto): Promise<StatusResponseDto> {
    const [imageModerationResult, textModerationResult] = await Promise.all([
      this.imageModerationService.moderateContent(multerToBlobUrl(file)),
      this.textModerationService.moderateContent(`${payload.title}; ${payload.description}`),
    ]);

    if (imageModerationResult) {
      throw new NotAcceptableException(`${imageModerationResult.join(", ")} media content is not allowed`);
    }

    if (textModerationResult) {
      throw new NotAcceptableException(`${textModerationResult.join(", ")} content is not allowed`);
    }

    const uploadedResource: Resource = await this.cloudService.uploadFile(
      accountId,
      file,
      {
        fileName: payload.title,
      },
      undefined,
      true,
    );

    const vectorId: string = randomUUID();
    const [textEmbedding, imageEmbedding] = await Promise.all([
      this.vectorService.generateTextEmbedding(payload.title, payload.description, payload.tags),
      this.vectorService.generateImageEmbedding(file),
    ]);

    await Promise.all([
      this.create({ ...payload, authorId: accountId, resource: uploadedResource._id, vectorId, textEmbedding, imageEmbedding }),
      this.vectorService.insertEmbedding(PinService.name, vectorId, textEmbedding, imageEmbedding),
    ]);

    return { message: "Pin created success" };
  }

  async updatePin(accountId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }

  async getPinDetail(pinId: Types.ObjectId, accountId?: Types.ObjectId): Promise<PinDetailDto> {
    const pipeline: any[] = [
      { $match: { _id: new Types.ObjectId(pinId) } },
      {
        $lookup: {
          from: "resources",
          localField: "resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      { $unwind: { path: "$resource", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "profiles",
          let: { authorId: "$authorId" },
          pipeline: [{ $match: { $expr: { $eq: ["$accountId", "$$authorId"] } } }, { $project: { _id: 1, authorId: 1, firstName: 1, lastName: 1, avatar: 1 } }],
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "boards",
          localField: "boardId",
          foreignField: "_id",
          as: "board",
        },
      },
      { $unwind: { path: "$board", preserveNullAndEmptyArrays: true } },
      ...(accountId
        ? [
            {
              $lookup: {
                from: "likes",
                let: { pinId: "$_id", accountId: { $toObjectId: accountId } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ["$pinId", "$$pinId"] }, { $eq: ["$accountId", "$$accountId"] }],
                      },
                    },
                  },
                ],
                as: "liked",
              },
            },
            { $addFields: { liked: { $gt: [{ $size: "$liked" }, 0] } } },
          ]
        : [{ $addFields: { liked: false } }]),
      {
        $project: {
          vectorId: 0,
          textEmbedding: 0,
          imageEmbedding: 0,
          "resource.__v": 0,
          "board.__v": 0,
          "author.__v": 0,
        },
      },
    ];

    const result = await this.aggregate(pipeline, { force: true });
    return result[0] || null;
  }

  async getAllPins(accountId: DocumentId): Promise<Array<Pin>> {
    return await this._model.find({ accountId }).exec();
  }

  async getSimilarPins(pinId: DocumentId, pagination: Pagination): Promise<InfiniteResponse<Pin>> {
    const pin = await this.find(pinId, { select: ["textEmbedding", "imageEmbedding"] });
    if (!pin) throw new NotFoundException("Pin not found");

    const similarPinIds = await this.vectorService.searchSimilar(PinService.name, pin.textEmbedding, pin.imageEmbedding, pagination.limit);

    return this.findMultipleInfinite({ vectorId: { $in: similarPinIds.map((s) => s.id) } }, pagination, {
      select: ["_id", "title", "tags", "isPublic", "resource"],
      populate: "resource",
    });
  }

  async deletePin(accountId: DocumentId, pinId: DocumentId): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });
    if (!pin) throw new NotFoundException("Pin not found for your profile");
    await this._model.deleteOne({ _id: pinId });
    return { message: "Pin deleted successfully" };
  }

  async getPinComments(pinId: DocumentId, pagination: Pagination): Promise<InfiniteResponse<CommentDetailDto>> {
    return (await this.commentService.findMultipleInfinite(this.commentService.getPinCommentDetailPipelineStages({ pinId }), pagination)) as any;
  }
}

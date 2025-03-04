import { NotAcceptableException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { multerToBlobUrl, Repository } from "@common/utils";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model, Types } from "mongoose";
import { randomUUID } from "crypto";

import { CreatePinDto, UpdatePinDto, PinDetailDto, Pin, CommentDetailDto } from "../models";
import { ImageModerationService, TextModerationService } from "@modules/moderation";
import { InfiniteResponse, PaginationResponse, StatusResponseDto } from "@common/dtos";
import { CloudService, Resource, ResourceService } from "@modules/cloud";
import { CommentService } from "./comment.service";
import { VectorService } from "@modules/vector";
import { CacheService } from "@modules/cache";
import { AccountService } from "@modules/account";
import { BoardService } from "@modules/board";

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
    private readonly accountService: AccountService,
    private readonly boardService: BoardService,
    private readonly resourceService: ResourceService,
  ) {
    super(pinModel, cacheService, Pin.name);
  }

  async createPin(accountId: DocumentId, file: Express.Multer.File, payload: CreatePinDto): Promise<StatusResponseDto> {
    const fileBlobUrl = multerToBlobUrl(file);

    const imageModerationResult = await this.imageModerationService.moderateContent(fileBlobUrl);

    if (imageModerationResult) {
      throw new NotAcceptableException(`${imageModerationResult.join(", ")} media content is not allowed`);
    }

    URL.revokeObjectURL(fileBlobUrl);

    const textModerationResult = await this.textModerationService.moderateContent(`${payload.title}; ${payload.description}`);

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
    const textEmbedding = await this.vectorService.generateTextEmbedding(payload.title, payload.description, payload.tags);
    const imageEmbedding = await this.vectorService.generateImageEmbedding(file);

    const accountConfig = await this.accountService.find(accountId, {
      select: ["allowComment"],
    });

    await Promise.all([
      this.create({
        allowComment: accountConfig.allowComment,
        ...payload,
        authorId: accountId,
        resource: new Types.ObjectId(uploadedResource._id),
        vectorId,
        textEmbedding,
        imageEmbedding,
        boardId: payload.boardId ? new Types.ObjectId(payload.boardId) : undefined,
      }),
      this.vectorService.insertEmbedding(PinService.name, vectorId, textEmbedding, imageEmbedding),
    ]);

    return { message: "Pin created success" };
  }

  async createPinByResource(accountId: DocumentId, resourceId: DocumentId, payload: CreatePinDto): Promise<StatusResponseDto> {
    const resource = await this.cloudService.getFile(resourceId);
    if (!resource) throw new NotFoundException("Resource not found");

    const imageUrl = URL.createObjectURL(await this.cloudService.getFile(resourceId));

    const [textEmbedding, imageEmbedding] = await Promise.all([
      this.vectorService.generateTextEmbedding(payload.title, payload.description, payload.tags),
      this.vectorService.generateImageEmbedding(imageUrl),
    ]);

    const vectorId: string = randomUUID();

    await Promise.all([
      this.create({ ...payload, authorId: accountId, resource: resourceId, vectorId, textEmbedding, imageEmbedding }),
      void this.vectorService.insertEmbedding(PinService.name, vectorId, textEmbedding, imageEmbedding),
    ]);

    void (await this.resourceService.update(resourceId, {
      isPrivate: false,
    }));

    URL.revokeObjectURL(imageUrl);

    return { message: "Pin created" };
  }

  async updatePin(accountId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }

  async getPinsByBoard(signature: DocumentId | string, pagination: Pagination, accountId?: DocumentId): Promise<PaginationResponse<Pin>> {
    const board = await this.boardService.find(
      {
        $or: [
          { seoName: signature },
          {
            _id: isValidObjectId(signature) ? new Types.ObjectId(signature) : new Types.ObjectId(),
          },
        ],
      },
      { select: ["isPrivate", "accountId"] },
    );

    if (!board) {
      throw new NotFoundException("Board not found");
    }

    if (board.isPrivate && accountId.toString() !== board.accountId.toString()) {
      throw new ForbiddenException("Forbidden to load board data");
    }

    return this.findMultiplePaging(
      {
        boardId: board._id,
      },
      pagination,
      { populate: "resource" },
    );
  }

  async getPinDetail(pinSignature: DocumentId | string, accountId?: Types.ObjectId): Promise<PinDetailDto> {
    const pipeline: any[] = [
      {
        $match: {
          $or: [
            {
              _id: isValidObjectId(pinSignature) ? new Types.ObjectId(pinSignature) : new Types.ObjectId(),
            },
            {
              seoName: pinSignature,
            },
          ],
        },
      },
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

    const result = await this.aggregate(pipeline);
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

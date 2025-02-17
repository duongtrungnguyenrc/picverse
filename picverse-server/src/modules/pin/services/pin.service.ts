import { NotAcceptableException, Injectable, NotFoundException, forwardRef, Inject } from "@nestjs/common";
import { multerToBlobUrl, Repository } from "@common/utils";
import { InjectModel } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { Model } from "mongoose";

import { ImageModerationService, TextModerationService } from "@modules/moderation";
import { CreatePinDto, UpdatePinDto, PinDetailResponseDto, Pin } from "../models";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { CloudService, Resource } from "@modules/cloud";
import { ProfileService } from "@modules/profile";
import { VectorService } from "@modules/vector";
import { CacheService } from "@modules/cache";
import { BoardService } from "@modules/board";
import { LikeService } from "./like.service";

@Injectable()
export class PinService extends Repository<Pin> {
  constructor(
    @InjectModel(Pin.name) pinModel: Model<Pin>,
    cacheService: CacheService,
    private readonly cloudService: CloudService,
    private readonly vectorService: VectorService,
    private readonly imageModerationService: ImageModerationService,
    private readonly textModerationService: TextModerationService,
    private readonly boardService: BoardService,
    private readonly profileService: ProfileService,
    @Inject(forwardRef(() => LikeService)) private readonly likeService: LikeService,
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

    const [textEmbedding, imageEmbedding] = await Promise.all([
      this.vectorService.generateTextEmbedding(payload.title, payload.description, payload.tags),
      this.vectorService.generateImageEmbedding(file),
    ]);
    const vectorId: string = randomUUID();

    const createdPin = await this.create({ ...payload, authorId: accountId, resource: uploadedResource._id, vectorId, textEmbedding, imageEmbedding });

    try {
      await this.vectorService.insertEmbedding(PinService.name, createdPin.vectorId, textEmbedding, imageEmbedding);
    } catch (error) {
      console.log(error);
    }

    return { message: "Pin created success" };
  }

  async updatePin(accountId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }

  async getPinDetail(pinId: DocumentId, accountId?: DocumentId): Promise<PinDetailResponseDto> {
    const { authorId, boardId, ...pin } = await this.find(pinId);

    const [board, author, isLiked] = await Promise.all([
      boardId ? this.boardService.find(boardId) : null,
      this.profileService.find({ accountId: authorId }, { select: ["_id", "authorId", "firstName", "lastName", "avatar"] }),
      accountId ? this.likeService.exists({ pinId, accountId }) : false,
    ]);

    return {
      ...pin,
      board,
      author,
      liked: !!isLiked,
    };
  }

  async getAllPins(accountId: DocumentId): Promise<Array<Pin>> {
    return await this._model.find({ accountId }).exec();
  }

  async getSimilarPins(pinId: DocumentId, pagination: Pagination): Promise<InfiniteResponse<Pin>> {
    const pin = await this.find(pinId, { select: ["textEmbedding", "imageEmbedding"] });
    if (!pin) throw new NotFoundException("Pin not found");

    const similarPinIds = await this.vectorService.searchSimilar(PinService.name, pin.textEmbedding, pin.imageEmbedding, pagination.limit);

    return this.findMultipleInfinite({ vectorId: { $in: similarPinIds.map((s) => s.id) } }, pagination);
  }

  async deletePin(accountId: DocumentId, pinId: DocumentId): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });
    if (!pin) throw new NotFoundException("Pin not found for your profile");
    await this._model.deleteOne({ _id: pinId });
    return { message: "Pin deleted successfully" };
  }
}

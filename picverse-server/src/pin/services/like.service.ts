import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { CreatePinLikeDto, EInteractionType, Like } from "../models";
import { PinInteractionService } from "./pin-interaction.service";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class LikeService extends Repository<Like> {
  constructor(
    @InjectModel(Like.name) commentModel: Model<Like>,
    cacheService: CacheService,
    @Inject(forwardRef(() => PinInteractionService)) private readonly pinInteractionService: PinInteractionService,
  ) {
    super(commentModel, cacheService);
  }

  async createLike(accountId: DocumentId, payload: CreatePinLikeDto): Promise<boolean> {
    const { pinId } = payload;

    const accountObjectId = new Types.ObjectId(accountId);
    const pinObjectId = new Types.ObjectId(pinId);
    const existedLike = await this.find({ accountId: accountObjectId, pinId: pinObjectId }, { force: true });

    if (existedLike) {
      await Promise.all([
        this.delete({ _id: existedLike._id }),
        this.pinInteractionService.delete({ accountId: accountObjectId, pinId: pinObjectId, type: EInteractionType.LIKE }),
      ]);

      return false;
    }

    await this.create({
      accountId: accountObjectId,
      pinId: pinObjectId,
    });

    this.pinInteractionService.createInteraction({
      accountId: accountObjectId,
      pinId: pinObjectId,
      type: EInteractionType.LIKE,
    });

    return true;
  }
}

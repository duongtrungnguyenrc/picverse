import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { PinInteractionService } from "./pin-interaction.service";
import { CreatePinLikeDto, EInteractionType, Like } from "../models";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";

@Injectable()
export class LikeService extends Repository<Like> {
  constructor(
    @InjectModel(Like.name) commentModel: Model<Like>,
    cacheService: CacheService,
    private readonly pinInteractionService: PinInteractionService,
  ) {
    super(commentModel, cacheService);
  }

  async createLike(accountId: DocumentId, payload: CreatePinLikeDto) {
    const { pinId } = payload;

    return await this.create({
      accountId,
      pinId,
    }).then((res) => {
      this.pinInteractionService.createInteraction({
        accountId,
        pinId,
        type: EInteractionType.LIKE,
      });
      return res;
    });
  }
}

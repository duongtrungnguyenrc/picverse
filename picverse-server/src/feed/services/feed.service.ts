import { Injectable } from "@nestjs/common";

import { Pin, PinInteractionService, PinService } from "@modules/pin";
import { VectorService } from "@modules/vector";
import { InfiniteResponse } from "@common/dtos";

@Injectable()
export class FeedService {
  constructor(
    private readonly pinService: PinService,
    private readonly pinInteractionService: PinInteractionService,
    private readonly vectorService: VectorService,
  ) {}

  async loadFeed(pagination: Pagination, accountId?: DocumentId): Promise<InfiniteResponse<Pin>> {
    const { page, limit } = pagination;
    let recommendedPins: Pin[] = [];
    let similarPinIds: string[] = [];

    if (accountId) {
      const interactionPins = await this.pinInteractionService.getModel().find({ accountId }, "pinId").sort({ createdAt: -1 }).limit(100).exec();

      const userPins = await this.pinService
        .getModel()
        .find({ _id: { $in: interactionPins.map((p) => p.pinId) } }, ["textEmbedding", "imageEmbedding"])
        .exec();

      if (userPins.length > 0) {
        const [sumText, sumImage] = userPins.reduce(
          ([textAcc, imageAcc], { textEmbedding, imageEmbedding }) => {
            textEmbedding.forEach((v, i) => (textAcc[i] += v));
            imageEmbedding.forEach((v, i) => (imageAcc[i] += v));
            return [textAcc, imageAcc];
          },
          [new Array(384).fill(0), new Array(384).fill(0)],
        );

        const avgTextEmbedding = sumText.map((v) => v / userPins.length);
        const avgImageEmbedding = sumImage.map((v) => v / userPins.length);

        similarPinIds = (await this.vectorService.searchSimilar(PinService.name, avgTextEmbedding, avgImageEmbedding, Math.ceil(limit))).map((s) => s.id);

        recommendedPins = await this.pinService
          .getModel()
          .find({ vectorId: { $in: similarPinIds } }, ["_id", "title", "tags", "isPublic", "resource"])
          .limit(Math.ceil(limit / 2));
      }
    }

    const remainingLimit = limit - recommendedPins.length;
    const randomPins = await this.pinService
      .getModel()
      .find({ vectorId: { $nin: similarPinIds } }, ["_id", "title", "tags", "isPublic", "resource"])
      .skip((page - 1) * remainingLimit)
      .limit(remainingLimit)
      .exec();

    const finalPins = [...recommendedPins, ...randomPins];

    const nextCursor = finalPins.length >= limit ? page + 1 : undefined;

    return {
      data: finalPins,
      nextCursor,
    };
  }
}

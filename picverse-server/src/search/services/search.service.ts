import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { ESearchTarget, SearchDto, SearchRecord } from "../models";
import { InfiniteResponse } from "@common/dtos";
import { Pin, PinService } from "@modules/pin";
import { Profile, ProfileService } from "@modules/profile";

@Injectable()
export class SearchService extends Repository<SearchRecord> {
  constructor(
    @InjectModel(SearchRecord.name) commentModel: Model<SearchRecord>,
    cacheService: CacheService,
    private readonly profileService: ProfileService,
    private readonly pinService: PinService,
  ) {
    super(commentModel, cacheService);
  }

  async getTrendingQueries(pagination: Pagination, timeframeInDays = 7): Promise<InfiniteResponse<string>> {
    const { page, limit } = pagination;

    const timeframe = new Date();
    timeframe.setDate(timeframe.getDate() - timeframeInDays);

    const trendingQueries = await this.aggregate([
      {
        $match: {
          createdAt: { $gte: timeframe },
        },
      },
      {
        $group: {
          _id: "$query",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          query: "$_id",
        },
      },
    ]);

    return {
      data: trendingQueries.map((q) => q.query),
    };
  }

  async getSearchHistory(accountId: DocumentId, pagination: Pagination): Promise<InfiniteResponse<SearchRecord>> {
    return await this.findMultipleInfinite({ accountId }, pagination, {
      sort: {
        createdAt: -1,
      },
    });
  }

  async search(accountId: DocumentId, payload: SearchDto, pagination: Pagination): Promise<InfiniteResponse<Pin | Profile>> {
    const { query, target } = payload;

    this.create({
      accountId,
      query,
    });

    switch (target) {
      default:
        return await this.pinService.findMultipleInfinite({ title: { $regex: query, $options: "i" } }, pagination);

      case ESearchTarget.PROFILE:
        return await this.profileService.findMultipleInfinite(
          {
            $or: [
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: query, options: "i" } } },
            ],
          },
          pagination,
        );
    }
  }
}

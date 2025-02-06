import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { StatusResponseDto } from "@common/dtos";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { CreateBoardDto } from "../dtos";
import { Board } from "../schemas";

@Injectable()
export class BoardService extends Repository<Board> {
  constructor(boardModel: Model<Board>, cacheService: CacheService) {
    super(boardModel, cacheService);
  }

  async createBoard(profileId: DocumentId, payload: CreateBoardDto): Promise<StatusResponseDto> {
    await this.create({
      ...payload,
      profileId,
    });

    return { message: "Board created success" };
  }
}

import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { StatusResponseDto } from "@common/dtos";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { CreateBoardDto } from "../models";
import { UpdateBoardDto } from "../models/dtos/update-board.dto";
import { Board } from "../models/schemas";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BoardService extends Repository<Board> {
  constructor(@InjectModel(Board.name) boardModel: Model<Board>, cacheService: CacheService) {
    super(boardModel, cacheService);
  }

  async createBoard(profileId: DocumentId, payload: CreateBoardDto): Promise<StatusResponseDto> {
    await this.create({
      ...payload,
      profileId,
    });

    return { message: "Board created success" };
  }
  async getAllBoards(): Promise<Board[]> {
    return await this._model.find().exec();
  }

  async deleteBoard(id: string): Promise<StatusResponseDto> {
    const deletedBoard = await this._model.findByIdAndDelete(id);
    if (!deletedBoard) throw new Error("Board not found");

    return { message: "Board deleted successfully" };
  }

  async updateBoard(id: string, payload: UpdateBoardDto): Promise<StatusResponseDto> {
    const updatedBoard = await this._model.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedBoard) throw new Error("Board not found");

    return { message: "Board updated successfully" };
  }
}

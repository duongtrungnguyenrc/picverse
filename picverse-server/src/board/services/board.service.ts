import { InjectModel } from "@nestjs/mongoose";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";

import { UpdateBoardDto } from "../models/dtos/request/update-board.dto";
import { StatusResponseDto } from "@common/dtos";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { CreateBoardDto, UserBoardDto } from "../models";
import { Board } from "../models/schemas";

@Injectable()
export class BoardService extends Repository<Board> {
  constructor(@InjectModel(Board.name) boardModel: Model<Board>, cacheService: CacheService) {
    super(boardModel, cacheService);
  }

  async createBoard(accountId: DocumentId, payload: CreateBoardDto): Promise<StatusResponseDto> {
    await this.create({
      ...payload,
      accountId: new Types.ObjectId(accountId),
    });

    return { message: "Board created success" };
  }

  async getUserBoards(accountId?: DocumentId): Promise<Array<UserBoardDto>> {
    if (!accountId) throw new BadRequestException("User not found");

    return await this.findMultiple<UserBoardDto>(
      [
        { $match: { accountId } },
        {
          $lookup: {
            from: "pins",
            localField: "_id",
            foreignField: "boardId",
            as: "allPins",
          },
        },
        {
          $set: { totalPins: { $size: "$allPins" } },
        },
        {
          $project: { allPins: 0 },
        },
        {
          $lookup: {
            from: "pins",
            let: { boardId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: [{ $toObjectId: "$boardId" }, "$$boardId"] } } },
              { $sort: { createdAt: +1 } },
              { $limit: 3 },
              {
                $lookup: {
                  from: "resources",
                  localField: "resource",
                  foreignField: "_id",
                  as: "resource",
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  resource: { $arrayElemAt: ["$resource", 0] },
                },
              },
            ],
            as: "latestPins",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            isPrivate: 1,
            totalPins: 1,
            latestPins: 1,
          },
        },
      ],
      { force: true },
    );
  }

  async deleteBoard(id: DocumentId): Promise<StatusResponseDto> {
    const deletedBoard = await this.delete(id);
    if (!deletedBoard) throw new Error("Board not found");

    return { message: "Board deleted successfully" };
  }

  async updateBoard(id: DocumentId, payload: UpdateBoardDto): Promise<StatusResponseDto> {
    const updatedBoard = await this.update(id, payload);
    if (!updatedBoard) throw new Error("Board not found");

    return { message: "Board updated successfully" };
  }
}

import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

import { AuthUid, Pagination } from "@common/decorators";
import { InfiniteResponse, StatusResponseDto } from "@common/dtos";
import { BoardService } from "../services";
import { CreateBoardDto, UpdateBoardDto, UserBoardDto } from "../models";

@Controller("board")
@ApiTags("Board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post("/")
  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: CreateBoardDto })
  async createBoard(@AuthUid() profileId: DocumentId, @Body() payload: CreateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.createBoard(profileId, payload);
  }

  @Get("/user")
  @ApiOperation({ summary: "Get user boards" })
  @ApiOkResponse({ type: [UserBoardDto] })
  async getUserBoards(@AuthUid() accountId?: DocumentId, @Query("id") userId?: DocumentId) {
    return await this.boardService.getUserBoards(accountId ?? userId);
  }

  @Delete("/:id")
  @ApiOkResponse({ type: StatusResponseDto })
  async deleteBoard(@Param("id") id: DocumentId): Promise<StatusResponseDto> {
    return await this.boardService.deleteBoard(id);
  }

  @Put("/:id")
  @ApiBody({ type: UpdateBoardDto })
  @ApiOkResponse({ type: StatusResponseDto })
  async updateBoard(@Param("id") id: DocumentId, @Body() payload: UpdateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.updateBoard(id, payload);
  }
}

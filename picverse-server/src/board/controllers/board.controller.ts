import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

import { ApiPagination, AuthUid, Pagination } from "@common/decorators";
import { InfiniteResponse, PaginationResponse, StatusResponseDto } from "@common/dtos";
import { BoardService } from "../services";
import { CreateBoardDto, UpdateBoardDto, UserBoardDto } from "../models";
import { Pin } from "@modules/pin";

@Controller("board")
@ApiTags("Board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post("/")
  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: CreateBoardDto })
  async createBoard(@AuthUid() accountId: DocumentId, @Body() payload: CreateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.createBoard(accountId, payload);
  }

  @Get("/user")
  @ApiOperation({ summary: "Get user boards" })
  @ApiQuery({ name: "signature", description: "Author account signature" })
  @ApiOkResponse({ type: [UserBoardDto] })
  async getUserBoards(@AuthUid() accountId?: DocumentId, @Query("signature") userId?: DocumentId) {
    return await this.boardService.getUserBoards(accountId ?? userId);
  }

  @Get("/:signature")
  @ApiParam({ name: "signature", description: "Board signature" })
  @ApiOperation({ summary: "Get board detail" })
  async getBoard(@Param("signature") signature: DocumentId | string, @AuthUid() accountId?: DocumentId) {
    return await this.boardService.getBoardDetail(signature, accountId);
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

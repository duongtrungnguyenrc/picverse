import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

import { AuthTokenPayload } from "@common/decorators";
import { StatusResponseDto } from "@common/dtos";
import { BoardService } from "../services";
import { CreateBoardDto, UpdateBoardDto } from "../models";

@Controller("board")
@ApiTags("Board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post("/")
  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: CreateBoardDto })
  async createBoard(@AuthTokenPayload("pid") profileId: DocumentId, @Body() payload: CreateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.createBoard(profileId, payload);
  }

  @Get("/")
  @ApiOkResponse({ type: CreateBoardDto })
  async getAllBoards(): Promise<CreateBoardDto[]> {
    return await this.boardService.getAllBoards();
  }

  @Delete("/:id")
  @ApiOkResponse({ type: StatusResponseDto })
  async deleteBoard(@Param("id") id: string): Promise<StatusResponseDto> {
    return await this.boardService.deleteBoard(id);
  }

  @Put("/:id")
  @ApiBody({ type: UpdateBoardDto })
  @ApiOkResponse({ type: StatusResponseDto })
  async updateBoard(@Param("id") id: string, @Body() payload: UpdateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.updateBoard(id, payload);
  }
}

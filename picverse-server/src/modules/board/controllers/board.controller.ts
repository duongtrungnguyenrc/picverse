import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";

import { Auth, AuthTokenPayload } from "@common/decorators";
import { StatusResponseDto } from "@common/dtos";
import { BoardService } from "../services";
import { CreateBoardDto } from "../dtos";

@Controller("board")
@ApiTags("Board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post("/")
  @Auth()
  @ApiBody({ type: CreateBoardDto })
  @ApiOkResponse({ type: CreateBoardDto })
  async createBoard(@AuthTokenPayload("pid") profileId: DocumentId, @Body() payload: CreateBoardDto): Promise<StatusResponseDto> {
    return await this.boardService.createBoard(profileId, payload);
  }
}

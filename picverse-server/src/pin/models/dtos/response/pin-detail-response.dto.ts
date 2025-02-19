import { ApiResponseProperty } from "@nestjs/swagger";

import { Resource } from "@modules/cloud";
import { Profile } from "@modules/profile";
import { Board } from "@modules/board";

export class PinDetailResponseDto {
  @ApiResponseProperty()
  author: Profile;

  @ApiResponseProperty()
  board: Board;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  resource: Resource | DocumentId;

  @ApiResponseProperty()
  tags: Array<string>;

  @ApiResponseProperty()
  isPublic: boolean;

  @ApiResponseProperty()
  allowComment: boolean;

  @ApiResponseProperty()
  allowShare: boolean;

  @ApiResponseProperty()
  vectorId: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  liked?: boolean;
}

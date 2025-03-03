import { ApiResponseProperty } from "@nestjs/swagger";

import { Resource } from "@modules/cloud";
import { Profile } from "@modules/profile";
import { Board } from "@modules/board";

export class PinDetailDto {
  @ApiResponseProperty()
  author: Profile;

  @ApiResponseProperty()
  board: Board;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  resource: Resource;

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
  seoName: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  liked?: boolean;
}

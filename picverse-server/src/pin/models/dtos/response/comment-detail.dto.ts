import { ApiResponseProperty } from "@nestjs/swagger";

import { Profile } from "@modules/profile";

export class CommentDetailDto {
  @ApiResponseProperty()
  by: Profile;

  @ApiResponseProperty()
  replyFor: DocumentId;

  @ApiResponseProperty()
  pinId: DocumentId;

  @ApiResponseProperty()
  content: string;

  @ApiResponseProperty()
  createdAt: Date;
}

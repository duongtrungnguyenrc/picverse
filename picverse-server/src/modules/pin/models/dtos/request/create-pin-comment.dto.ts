import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

export class CreatePinCommentDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsMongoId()
  pinId: DocumentId;
}

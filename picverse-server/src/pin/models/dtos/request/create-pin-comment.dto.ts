import { IsMongoId, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePinCommentDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsMongoId()
  pinId: DocumentId;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  replyFor?: DocumentId;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

export class CreatePinLikeDto {
  @ApiProperty()
  @IsMongoId()
  pinId: DocumentId;
}

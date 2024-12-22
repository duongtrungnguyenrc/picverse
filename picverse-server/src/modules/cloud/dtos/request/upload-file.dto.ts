import { IsMongoId, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsMongoId()
  parentId?: DocumentId;
}

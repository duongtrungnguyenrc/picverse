import { IsMongoId, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateFolderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsMongoId()
  parentId?: DocumentId;
}

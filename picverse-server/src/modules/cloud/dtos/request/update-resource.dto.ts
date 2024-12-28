import { IsBoolean, IsMongoId, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateResourceDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsMongoId()
  parentId?: DocumentId;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

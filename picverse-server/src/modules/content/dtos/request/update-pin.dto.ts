import { IsArray, IsBoolean, IsMongoId, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePinDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  boardId?: DocumentId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags?: Array<string>;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowComment?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowShare?: boolean;
}

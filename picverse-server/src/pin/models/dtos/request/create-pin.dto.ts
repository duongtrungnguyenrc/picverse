import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePinDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  boardId?: string;

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

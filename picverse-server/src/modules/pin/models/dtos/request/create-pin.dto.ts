import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
  @IsArray({})
  resources: Array<DocumentId>;

  @ApiProperty()
  @IsArray()
  tags: Array<string>;

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

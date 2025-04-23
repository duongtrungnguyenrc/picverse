import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { ECloudStorage } from "../../enums";

export class CreateFolderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ECloudStorage)
  storage?: ECloudStorage;
}

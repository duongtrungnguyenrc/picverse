import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { EGender } from "../enums";

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birth?: string;

  @ApiProperty()
  @IsEnum(EGender)
  @IsOptional()
  gender?: EGender;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

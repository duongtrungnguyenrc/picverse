import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { EInboxConfig } from "../../enums";

export class UpdateAccountConfigDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowNotify: boolean;

  @ApiProperty()
  @IsEnum(EInboxConfig)
  @IsOptional()
  inboxConfig: EInboxConfig;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowComment: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  allowEmail: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  twoFASecret?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  enable2FA: boolean;
}

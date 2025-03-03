import { ApiResponseProperty } from "@nestjs/swagger";

import { EInboxConfig } from "../../enums";

export class AccountConfigDto {
  @ApiResponseProperty()
  allowNotify: boolean;

  @ApiResponseProperty()
  inboxConfig: EInboxConfig;

  @ApiResponseProperty()
  allowComment: boolean;

  @ApiResponseProperty()
  allowEmail: boolean;

  @ApiResponseProperty()
  twoFASecret?: string;

  @ApiResponseProperty()
  enable2FA: boolean;
}

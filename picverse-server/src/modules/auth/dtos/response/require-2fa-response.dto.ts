import { ApiResponseProperty } from "@nestjs/swagger";

export class Require2FAResponseDto {
  @ApiResponseProperty()
  accountId: DocumentId;

  @ApiResponseProperty()
  profileId: DocumentId;

  @ApiResponseProperty()
  require2FA: boolean;
}

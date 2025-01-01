import { ApiResponseProperty } from "@nestjs/swagger";

export class Require2FAResponseDto {
  @ApiResponseProperty()
  accountId: DocumentId;

  @ApiResponseProperty()
  require2FA: boolean;
}

import { ApiResponseProperty } from "@nestjs/swagger";

export class RefreshTokenResponseDto implements TokenPair {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}

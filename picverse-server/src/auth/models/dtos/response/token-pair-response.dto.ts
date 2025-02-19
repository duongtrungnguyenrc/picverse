import { ApiResponseProperty } from "@nestjs/swagger";

export class TokenPairResponseDto implements TokenPair {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}

import { ApiResponseProperty } from "@nestjs/swagger";

export class SignInResponseDto implements TokenPair {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}

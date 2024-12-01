import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { SignInRequestDto, SignInResponseDto, SignUpRequestDto } from "../dtos";
import { AuthService } from "../services";
import { Auth } from "@common/decorators";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth()
  @Post("/sign-up")
  async signUp(@Body() data: SignUpRequestDto) {
    return this.authService.signUp(data);
  }

  @Post("/sign-in")
  @ApiOkResponse({ type: SignInResponseDto })
  async signIn(@Body() data: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(data);
  }
}

import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param, Post } from "@nestjs/common";

import {
  ForgotPasswordDto,
  LockAccountDto,
  RefreshTokenResponseDto,
  RequestActiveAccountDto,
  ResetPasswordDto,
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
} from "../dtos";
import { Auth, AuthToken, AuthUid, IpAddress, RequestAgent } from "@common/decorators";
import { AuthApiDescription } from "../enums";
import { AccountService } from "../services";

@Controller("account")
@ApiTags("Account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("/sign-up")
  @ApiResponse({ status: 200, description: AuthApiDescription.SIGN_UP_SUCCESS, type: Boolean })
  async signUp(@Body() data: SignUpRequestDto): Promise<boolean> {
    return this.accountService.signUp(data);
  }

  @Post("/sign-in")
  @ApiResponse({ status: 200, description: AuthApiDescription.SIGN_IN_SUCCESS, type: SignInResponseDto })
  async signIn(@Body() data: SignInRequestDto, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.signIn(data, ipAddress, requestAgent);
  }

  @Post("/refresh-token")
  @ApiResponse({ status: 200, description: AuthApiDescription.REFRESH_TOKEN_SUCCESS, type: RefreshTokenResponseDto })
  async refreshToken(@AuthToken() refreshToken: string, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.refreshToken(refreshToken, ipAddress, requestAgent);
  }

  @Post("/forgot-password")
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: AuthApiDescription.FORGOT_PASSWORD_SUCCESS, type: String })
  async forgotPassword(@Body() payload: ForgotPasswordDto, @IpAddress() ipAddress: string): Promise<string> {
    return await this.accountService.forgotPassword(payload, ipAddress);
  }

  @Post("/reset-password")
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: AuthApiDescription.RESET_PASSWORD_SUCCESS, type: Boolean })
  async resetPassword(@Body() payload: ResetPasswordDto, @IpAddress() ipAddress: string): Promise<boolean> {
    return await this.accountService.resetPassword(payload, ipAddress);
  }

  @Auth()
  @Post("/lock")
  @ApiResponse({ status: 200, description: AuthApiDescription.LOCK_ACCOUNT_SUCCESS, type: Boolean })
  async lockAccount(@AuthUid() userId: DocumentId, @Body() payload: LockAccountDto): Promise<boolean> {
    return await this.accountService.lockAccount(userId, payload);
  }

  @Post("request-activation")
  @ApiResponse({ status: 200, description: AuthApiDescription.REQUEST_ACTIVATE_ACCOUNT_SUCCESS, type: Boolean })
  async requestActivationOtp(@Body() payload: RequestActiveAccountDto, @IpAddress() ipAddress: string): Promise<boolean> {
    return this.accountService.requestActivateAccount(payload, ipAddress);
  }

  @Post("activate-account")
  @ApiParam({ name: "session" })
  @ApiResponse({ status: 200, description: AuthApiDescription.ACTIVATE_ACCOUNT_SUCCESS, type: Boolean })
  async activateAccount(@Param("session") sessionId: string, @IpAddress() ipAddress: string): Promise<boolean> {
    return this.accountService.activateAccount(sessionId, ipAddress);
  }
}

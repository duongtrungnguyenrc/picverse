import { ApiBearerAuth, ApiBody, ApiHeader, ApiOkResponse, ApiTags, ApiCreatedResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";

import { Disable2faDto, RefreshTokenResponseDto, Require2FAResponseDto, SignInRequestDto, TokenPairResponseDto, TwoFactorSignInRequestDto, Verify2FARequestDto } from "../dtos";
import { Auth, AuthToken, AuthTokenPayload, AuthUid, IpAddress, RequestAgent } from "@common/decorators";
import { StatusResponseDto } from "@common/dtos";
import { AuthService } from "../services";
import { JWTRefreshAuthGuard } from "@common/guards";

@Controller("/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/sign-in")
  @ApiOperation({ summary: "Sign in to web" })
  @ApiBody({ type: SignInRequestDto })
  @ApiCreatedResponse({ description: "Sign in success. Return token pair", type: TokenPairResponseDto })
  @ApiOkResponse({ description: "Sign in success require two factor auth. Return status", type: Require2FAResponseDto })
  async signIn(
    @Body() payload: SignInRequestDto,
    @IpAddress() ipAddress: string,
    @RequestAgent() requestAgent: RequestAgent,
  ): Promise<TokenPairResponseDto | Require2FAResponseDto> {
    return await this.authService.signIn(payload, ipAddress, requestAgent);
  }

  @Post("/sign-in/2fa")
  @ApiOperation({ summary: "Sign in to web" })
  @ApiBody({ type: TwoFactorSignInRequestDto })
  @ApiCreatedResponse({ description: "Sign in success. Return token pair", type: TokenPairResponseDto })
  @ApiOkResponse({ description: "Sign in success require two factor auth. Return status", type: Require2FAResponseDto })
  async signInWith2FA(
    @Body() payload: TwoFactorSignInRequestDto,
    @IpAddress() ipAddress: string,
    @RequestAgent() requestAgent: RequestAgent,
  ): Promise<TokenPairResponseDto | Require2FAResponseDto> {
    return await this.authService.signInWith2FA(payload, ipAddress, requestAgent);
  }

  @Get("/oauth")
  @ApiOperation({ summary: "Sign in to web with third party" })
  @ApiQuery({ name: "secret", description: "Secret key for validate client" })
  signInWithThirdParty(@Query("secret") secret: string, @Res() response: Response): void {
    this.authService.getGoogleOAuthUrl(secret, response);
  }

  @Auth()
  @Post("/sign-out")
  @ApiOperation({ summary: "Sign out" })
  @ApiOkResponse({ type: StatusResponseDto })
  async signOut(@AuthTokenPayload("sid") sid: string): Promise<StatusResponseDto> {
    return await this.authService.signOut(sid);
  }

  @Get("/webhooks/callback")
  @ApiOperation({ summary: "Third party sign in callback" })
  async thirdPartyAuthCallback(
    @Query("code") code: string,
    @Query("state") state: string,
    @IpAddress() ipAddress: string,
    @RequestAgent() requestAgent: RequestAgent,
    @Res() response: Response,
  ) {
    return await this.authService.handleGoogleAuthCallback(code, state, ipAddress, requestAgent, response);
  }

  @Post("/refresh-token")
  @Auth(JWTRefreshAuthGuard)
  @ApiOperation({ summary: "Refresh new access token pair" })
  @ApiBearerAuth()
  @ApiHeader({ name: "authorization", description: "Jwt Bearer refresh token" })
  @ApiCreatedResponse({ description: "Refresh token success. Return new token pair", type: RefreshTokenResponseDto })
  async refreshToken(@AuthToken() refreshToken: string, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<TokenPairResponseDto> {
    return await this.authService.refreshToken(refreshToken, ipAddress, requestAgent);
  }

  @Auth()
  @Post("2fa/enable")
  @ApiOperation({ summary: "Enable 2FA" })
  @ApiCreatedResponse({ description: "Successfully enable 2FA. Return status", type: String })
  async enable2FA(@AuthUid() accountId: DocumentId): Promise<string> {
    return await this.authService.enable2FA(accountId);
  }

  @Auth()
  @Post("2fa/disable")
  @ApiBody({ type: Disable2faDto })
  @ApiOperation({ summary: "Disable 2FA" })
  @ApiCreatedResponse({ description: "Successfully disable 2FA. Return status", type: StatusResponseDto })
  async disable2FA(@AuthUid() accountId: DocumentId, @Body() payload: Disable2faDto): Promise<StatusResponseDto> {
    return await this.authService.disable2FA(accountId, payload);
  }

  @Auth()
  @Post("2fa/verify")
  @ApiOperation({ summary: "Verify 2FA" })
  @ApiBody({ type: Verify2FARequestDto })
  @ApiCreatedResponse({ description: "Successfully verify 2FA. Return status", type: StatusResponseDto })
  async verify2FA(@AuthUid() accountId: DocumentId, @Body() payload: Verify2FARequestDto): Promise<StatusResponseDto> {
    return await this.authService.verify2FA(accountId, payload.otpCode);
  }
}

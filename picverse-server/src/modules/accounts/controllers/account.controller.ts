import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiOkResponse, ApiTags, ApiCreatedResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";

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
import { ApiPagination, Auth, AuthToken, AuthTokenPayload, AuthUid, IpAddress, Pagination, RequestAgent } from "@common/decorators";
import { AccessRecordService, AccountService } from "../services";
import { AccessRecord, Account } from "../schemas";
import { PaginationResponse, StatusResponseDto } from "@common/dtos";
import { Response } from "express";

@Controller("accounts")
@ApiTags("Accounts")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly accessRecordService: AccessRecordService,
  ) {}

  @Post("/sign-up")
  @ApiOperation({ summary: "Register new account & profile" })
  @ApiBody({ type: SignUpRequestDto })
  @ApiCreatedResponse({ description: "Sign up account success. Return new account", type: Account })
  async signUp(@Body() data: SignUpRequestDto): Promise<Account> {
    return this.accountService.signUp(data);
  }

  @Auth()
  @Post("/authorize")
  @ApiOperation({ summary: "Authorize client" })
  auth(@AuthUid() accountId: DocumentId): Pick<Account, "_id"> {
    return { _id: accountId };
  }

  @Post("/sign-in")
  @ApiOperation({ summary: "Sign in to web" })
  @ApiBody({ type: SignInRequestDto })
  @ApiCreatedResponse({ description: "Sign in success. Return token pair", type: SignInResponseDto })
  async signIn(@Body() data: SignInRequestDto, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.signIn(data, ipAddress, requestAgent);
  }

  @Get("/sign-in")
  @ApiOperation({ summary: "Sign in to web with third party" })
  @ApiQuery({ name: "secret", description: "Secret key for validate client" })
  signInWithThirdParty(@Query("secret") secret: string, @Res() response: Response): void {
    this.accountService.getGoogleOAuthUrl(secret, response);
  }

  @Auth()
  @Post("/sign-out")
  @ApiOperation({ summary: "Sign out" })
  @ApiOkResponse({ type: StatusResponseDto })
  async signOut(@AuthTokenPayload("sub") sub: string): Promise<StatusResponseDto> {
    return await this.accountService.signOut(sub);
  }

  @Get("/webhooks/auth-callback")
  @ApiOperation({ summary: "Third party sign in callback" })
  async thirdPartyAuthCallback(
    @Query("code") code: string,
    @Query("state") state: string,
    @IpAddress() ipAddress: string,
    @RequestAgent() requestAgent: RequestAgent,
    @Res() response: Response,
  ) {
    return await this.accountService.handleGoogleAuthCallback(code, state, ipAddress, requestAgent, response);
  }

  @Post("/refresh-token")
  @ApiOperation({ summary: "Refresh new access token pair" })
  @ApiBearerAuth()
  @ApiHeader({ name: "authorization", description: "Jwt Bearer refresh token" })
  @ApiCreatedResponse({ description: "Refresh token success. Return new token pair", type: RefreshTokenResponseDto })
  async refreshToken(@AuthToken() refreshToken: string, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.refreshToken(refreshToken, ipAddress, requestAgent);
  }

  @Post("/forgot-password")
  @ApiOperation({ summary: "Create forgot password session" })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiCreatedResponse({ description: "Forgot password success. Return session id", type: String })
  async forgotPassword(@Body() payload: ForgotPasswordDto, @IpAddress() ipAddress: string): Promise<string> {
    return await this.accountService.forgotPassword(payload, ipAddress);
  }

  @Post("/reset-password")
  @ApiOperation({ summary: "Reset password" })
  @ApiBody({ type: ResetPasswordDto })
  @ApiCreatedResponse({ description: "Reset password success. Return status", type: StatusResponseDto })
  async resetPassword(@Body() payload: ResetPasswordDto, @IpAddress() ipAddress: string): Promise<StatusResponseDto> {
    return await this.accountService.resetPassword(payload, ipAddress);
  }

  @Auth()
  @Post("/lock")
  @ApiOperation({ summary: "Lock account" })
  @ApiBody({ type: LockAccountDto })
  @ApiCreatedResponse({ description: "Lock account success. Return status", type: StatusResponseDto })
  async lockAccount(@AuthUid() userId: DocumentId, @Body() payload: LockAccountDto): Promise<StatusResponseDto> {
    return await this.accountService.lockAccount(userId, payload);
  }

  @Post("/request-activation")
  @ApiOperation({ summary: "Rquest reactivate account" })
  @ApiBody({ type: RequestActiveAccountDto })
  @ApiCreatedResponse({ description: "Successfully request activate account Return status", type: StatusResponseDto })
  async requestActivationOtp(@Body() payload: RequestActiveAccountDto, @IpAddress() ipAddress: string): Promise<StatusResponseDto> {
    return this.accountService.requestActivateAccount(payload, ipAddress);
  }

  @Post("/activate-account")
  @ApiOperation({ summary: "activate account" })
  @ApiParam({ name: "session" })
  @ApiCreatedResponse({ description: "Successfully activate account Return status", type: Boolean })
  async activateAccount(@Param("session") sessionId: string, @IpAddress() ipAddress: string): Promise<boolean> {
    return this.accountService.activateAccount(sessionId, ipAddress);
  }

  @Auth()
  @Get("/access")
  @ApiOperation({ summary: "Get access histories" })
  @ApiPagination()
  @ApiOkResponse({ description: "Successfully lto get access records. Return pagination records", type: PaginationResponse<AccessRecord> })
  async getAccessRecords(@AuthUid() accountId: DocumentId, @Pagination() pagination: Pagination): Promise<PaginationResponse<AccessRecord>> {
    return this.accessRecordService.findMultiplePaging({ account: accountId }, pagination);
  }
}

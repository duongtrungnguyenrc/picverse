import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiOkResponse, ApiTags, ApiCreatedResponse } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";

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
import { ApiPagination, Auth, AuthToken, AuthUid, IpAddress, Pagination, RequestAgent } from "@common/decorators";
import { AccessRecordService, AccountService } from "../services";
import { AccessRecord, Account } from "../schemas";
import { PaginationResponse } from "@common/dtos";

@Controller("accounts")
@ApiTags("Accounts")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly accessRecordService: AccessRecordService,
  ) {}

  @Post("/sign-up")
  @ApiBody({ type: SignUpRequestDto })
  @ApiCreatedResponse({ description: "Sign up account success. Return new account", type: Account })
  async signUp(@Body() data: SignUpRequestDto): Promise<Account> {
    return this.accountService.signUp(data);
  }

  @Post("/sign-in")
  @ApiBody({ type: SignInRequestDto })
  @ApiCreatedResponse({ description: "Sign in success. Return token pair", type: SignInResponseDto })
  async signIn(@Body() data: SignInRequestDto, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.signIn(data, ipAddress, requestAgent);
  }

  @Post("/refresh-token")
  @ApiBearerAuth()
  @ApiHeader({ name: "authorization", description: "Jwt Bearer refresh token" })
  @ApiCreatedResponse({ description: "Refresh token success. Return new token pair", type: RefreshTokenResponseDto })
  async refreshToken(@AuthToken() refreshToken: string, @IpAddress() ipAddress: string, @RequestAgent() requestAgent: RequestAgent): Promise<SignInResponseDto> {
    return await this.accountService.refreshToken(refreshToken, ipAddress, requestAgent);
  }

  @Post("/forgot-password")
  @ApiBody({ type: ForgotPasswordDto })
  @ApiCreatedResponse({ description: "Forgot password success. Return session id", type: String })
  async forgotPassword(@Body() payload: ForgotPasswordDto, @IpAddress() ipAddress: string): Promise<string> {
    return await this.accountService.forgotPassword(payload, ipAddress);
  }

  @Post("/reset-password")
  @ApiBody({ type: ResetPasswordDto })
  @ApiCreatedResponse({ description: "Reset password success. Return status", type: Boolean })
  async resetPassword(@Body() payload: ResetPasswordDto, @IpAddress() ipAddress: string): Promise<boolean> {
    return await this.accountService.resetPassword(payload, ipAddress);
  }

  @Auth()
  @Post("/lock")
  @ApiBody({ type: LockAccountDto })
  @ApiCreatedResponse({ description: "Lock account success. Return status", type: Boolean })
  async lockAccount(@AuthUid() userId: DocumentId, @Body() payload: LockAccountDto): Promise<boolean> {
    return await this.accountService.lockAccount(userId, payload);
  }

  @Post("/request-activation")
  @ApiBody({ type: RequestActiveAccountDto })
  @ApiCreatedResponse({ description: "Successfully request activate account Return status", type: Boolean })
  async requestActivationOtp(@Body() payload: RequestActiveAccountDto, @IpAddress() ipAddress: string): Promise<boolean> {
    return this.accountService.requestActivateAccount(payload, ipAddress);
  }

  @Post("/activate-account")
  @ApiParam({ name: "session" })
  @ApiCreatedResponse({ description: "Successfully activate account Return status", type: Boolean })
  async activateAccount(@Param("session") sessionId: string, @IpAddress() ipAddress: string): Promise<boolean> {
    return this.accountService.activateAccount(sessionId, ipAddress);
  }

  @Auth()
  @Get("/access")
  @ApiPagination()
  @ApiOkResponse({ description: "Successfully lto get access records. Return pagination records", type: PaginationResponse<AccessRecord> })
  async getAccessRecords(@AuthUid() accountId: DocumentId, @Pagination() pagination: Pagination): Promise<PaginationResponse<AccessRecord>> {
    return this.accessRecordService.findMultiplePaging({ account: accountId }, pagination);
  }
}

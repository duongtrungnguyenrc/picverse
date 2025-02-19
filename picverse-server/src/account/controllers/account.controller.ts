import { ApiBody, ApiParam, ApiTags, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { ChangePasswordRequestDto, ForgotPasswordDto, LockAccountDto, RequestActiveAccountDto, ResetPasswordDto, SignUpRequestDto } from "../models";
import { Auth, AuthTokenPayload, AuthUid, IpAddress } from "@common/decorators";
import { StatusResponseDto } from "@common/dtos";
import { AccountService } from "../services";
import { Account } from "../models/schemas";

@Controller("account")
@ApiTags("Account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("/sign-up")
  @ApiOperation({ summary: "Register new account & profile" })
  @ApiBody({ type: SignUpRequestDto })
  @ApiCreatedResponse({ description: "Sign up account success. Return status", type: StatusResponseDto })
  async signUp(@Body() payload: SignUpRequestDto): Promise<StatusResponseDto> {
    return await this.accountService.signUp(payload);
  }

  @Auth()
  @Put("/password")
  @ApiOperation({ summary: "Update password" })
  @ApiBody({ type: ChangePasswordRequestDto })
  @ApiCreatedResponse({ description: "Update password success. Return status", type: StatusResponseDto })
  async changePassword(@AuthUid() accountId: DocumentId, @AuthTokenPayload("sid") sessionId: DocumentId, @Body() payload: ChangePasswordRequestDto): Promise<StatusResponseDto> {
    return await this.accountService.changePassword(accountId, sessionId, payload);
  }

  @Auth()
  @Get("/")
  @ApiOperation({ summary: "Get Account" })
  async getAccount(@AuthUid() accountId: DocumentId): Promise<Account> {
    return await this.accountService.getAccount(accountId);
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
}

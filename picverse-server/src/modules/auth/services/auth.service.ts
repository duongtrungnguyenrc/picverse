import { BadRequestException, forwardRef, Inject, Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Auth, google } from "googleapis";
import { authenticator } from "otplib";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { randomInt } from "crypto";
import { Response } from "express";

import { Disable2faDto, RefreshTokenResponseDto, Require2FAResponseDto, SignInRequestDto, TokenPairResponseDto, TwoFactorSignInRequestDto } from "../models";
import { Account, AccountService } from "@modules/account";
import { SessionService } from "@modules/session";
import { ProfileService } from "@modules/profile";
import { StatusResponseDto } from "@common/dtos";
import { AccountErrorMessage } from "../enums";
import { EOAuthScopes } from "@common/enums";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
  private oAuthClient: Auth.OAuth2Client;

  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly sesisonService: SessionService,
    private readonly configService: ConfigService,
  ) {
    this.oAuthClient = new google.auth.OAuth2(
      this.configService.get<string>("OAUTH_CLIENT_ID"),
      this.configService.get<string>("OAUTH_CLIENT_SECRET"),
      this.configService.get<string>("OAUTH_CALLBACK_URL"),
    );
  }

  async getGoogleOAuthUrl(secret: string, response: Response): Promise<void> {
    const scopes: Array<string> = [EOAuthScopes.USER_INFO_PROFILE, EOAuthScopes.USER_INFO_EMAIL];

    const authUrl: string = this.oAuthClient.generateAuthUrl({
      scope: scopes,
      state: Buffer.from(secret).toString("base64"),
    });

    response.redirect(authUrl);
  }

  async handleGoogleAuthCallback(code: string, state: string, ipAddress: string, requestAgent: RequestAgent, response: Response): Promise<void> {
    try {
      const { tokens } = await this.oAuthClient.getToken(code);
      this.oAuthClient.setCredentials(tokens);

      const oauth2 = google.oauth2("v2");
      const userInfoResponse = await oauth2.userinfo.get({
        auth: this.oAuthClient,
      });
      const userInfo = userInfoResponse.data;

      const account: Account = await this.accountService.find({ email: userInfo.email });
      const signInResponse: Partial<TokenPairResponseDto> = {};

      if (!account) {
        const newAccount: Account = await this.accountService.create({
          userName: userInfo.email.split("@")[0] + randomInt(8),
          email: userInfo.email,
        });

        const newProfile = await this.profileService.create({ accountId: newAccount._id, firstName: userInfo.given_name, lastName: userInfo.family_name });

        const tokenPair = await this.sesisonService.createSession(newAccount._id, newProfile._id, ipAddress, requestAgent);
        Object.assign(signInResponse, tokenPair);
      } else {
        const profile = await this.profileService.exists({ accountId: new Types.ObjectId(account._id) });

        const tokenPair = await this.sesisonService.createSession(account._id, profile._id, ipAddress, requestAgent);
        Object.assign(signInResponse, tokenPair);
      }

      const secret: string = Buffer.from(state, "base64").toString("utf-8");
      const clientOrigin = this.configService.get<string>("CLIENT_ORIGIN");

      response.redirect(`${clientOrigin}/oauth/callback?token=${sign({ secret, ...signInResponse }, secret, { expiresIn: 60 * 60 * 1000 })}`);
    } catch (error) {
      console.error("Error during Google Auth Callback:", error);
      response.status(500).send("Authentication failed");
    }
  }

  async signIn(payload: SignInRequestDto, ipAddress: string, requestAgent: RequestAgent): Promise<TokenPairResponseDto | Require2FAResponseDto> {
    const { emailOrUserName, password } = payload;

    const account: Account = await this.accountService.find(
      { $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] },
      {
        select: ["_id", "password", "isActive", "twoFASecret", "enable2FA"],
        force: true,
      },
    );

    const profile = await this.profileService.find({ accountId: account._id }, { select: ["_id"] });

    if (!account || !profile || !compareSync(password, account.password)) {
      throw new UnauthorizedException(AccountErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    if (!account.isActive) {
      throw new UnauthorizedException(AccountErrorMessage.ACCOUNT_LOKED);
    }

    if (account.enable2FA) {
      return {
        accountId: account._id,
        profileId: profile._id,
        require2FA: true,
      };
    }

    return this.sesisonService.createSession(account._id, profile._id, ipAddress, requestAgent);
  }

  async signInWith2FA(payload: TwoFactorSignInRequestDto, ipAddress: string, requestAgent: RequestAgent): Promise<TokenPairResponseDto> {
    const isValid = await this.verify2FA(payload.accountId, payload.otpCode);
    if (!isValid) throw new UnauthorizedException(AccountErrorMessage.INVALID_OTP);

    return this.sesisonService.createSession(payload.accountId, payload.profileId, ipAddress, requestAgent);
  }

  async signOut(sid: string): Promise<StatusResponseDto> {
    await this.sesisonService.revokeSession(sid);

    return { message: "Sign out success" };
  }

  async refreshToken(refreshToken: string, ipAddress: string, requestAgent: RequestAgent): Promise<RefreshTokenResponseDto> {
    return await this.sesisonService.refreshSession(refreshToken, ipAddress, requestAgent);
  }

  async enable2FA(accountId: DocumentId): Promise<string> {
    const account = await this.accountService.find(accountId, { select: ["_id", "email"] });
    if (!account) throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);

    const secret = authenticator.generateSecret();

    await this.accountService.update(accountId, {
      twoFASecret: secret,
      enable2FA: true,
    });

    return authenticator.keyuri(account.email, "Picverse", secret);
  }

  async disable2FA(accountId: DocumentId, payload: Disable2faDto): Promise<StatusResponseDto> {
    try {
      await this.verify2FA(accountId, payload.otpCode);

      const account = await this.accountService.find(accountId, { select: ["_id", "password", "twoFASecret", "enable2FA"] });
      if (!account) throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
      if (!compareSync(payload.password, account.password)) throw new BadRequestException(AccountErrorMessage.WRONG_PASSWORD);
      if (!account.enable2FA) throw new BadRequestException(AccountErrorMessage.TWO_FACTOR_AUTH_NOT_ENABLED);

      await this.accountService.update(accountId, { enable2FA: false, twoFASecret: null });
      return { message: "Two-factor authentication disabled successfully" };
    } catch (error) {
      throw error;
    }
  }

  async verify2FA(accountId: DocumentId, otpCode: string): Promise<StatusResponseDto> {
    const account = await this.accountService.find(accountId, { select: ["_id", "twoFASecret", "enable2FA"] });

    if (!account || !account.enable2FA) {
      throw new BadRequestException(AccountErrorMessage.TWO_FACTOR_AUTH_NOT_ENABLED);
    }

    const isValid = authenticator.check(otpCode, account.twoFASecret);

    if (!isValid) {
      throw new NotAcceptableException(AccountErrorMessage.INVALID_OTP);
    }

    return { message: "Two-factor authentication verified successfully" };
  }
}

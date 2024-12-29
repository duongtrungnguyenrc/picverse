import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { compareSync, genSalt, hash } from "bcrypt";
import { ClientSession, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Auth, google } from "googleapis";
import { randomInt } from "crypto";
import { Response } from "express";
import { v4 as uuid } from "uuid";
import { sign } from "jsonwebtoken";

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
import { ACTIVATE_ACCOUNT_TRANSACTION_CACHE_PREFIX, OTP_LENGTH, OTP_TTL, RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX } from "../constants";
import { Repository, withMutateTransaction } from "@common/utils";
import { AccessRecordService } from "./access-record.service";
import { CacheService, joinCacheKey } from "@modules/cache";
import { MailSubject, AccountErrorMessage } from "../enums";
import { JwtRefreshService } from "@modules/jwt-refresh";
import { JwtAccessService } from "@modules/jwt-access";
import { ProfileService } from "@modules/profile";
import { EOAuthScopes } from "@common/enums";
import { Account } from "../schemas";
import { StatusResponseDto } from "@common/dtos";

@Injectable()
export class AccountService extends Repository<Account> {
  private oAuthClient: Auth.OAuth2Client;

  constructor(
    @InjectModel(Account.name) AccountModel: Model<Account>,
    private readonly jwtAccessService: JwtAccessService,
    private readonly jwtRefreshService: JwtRefreshService,
    private readonly mailerService: MailerService,
    private readonly profileService: ProfileService,
    private readonly accessRecordService: AccessRecordService,
    private readonly configService: ConfigService,
    cacheService: CacheService,
  ) {
    super(AccountModel, cacheService);

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

      const account: Account = await this.find({ email: userInfo.email });
      const signInResponse: Partial<SignInResponseDto> = {};

      if (!account) {
        const newAccount: Account = await this.create({
          userName: userInfo.email.split("@")[0] + randomInt(8),
          email: userInfo.email,
        });

        this.profileService.create({ account: newAccount._id, firstName: userInfo.given_name, lastName: userInfo.family_name });

        const tokenPair = this.generateTokenPair(newAccount._id, ipAddress, requestAgent);
        Object.assign(signInResponse, tokenPair);
      }

      const tokenPair = this.generateTokenPair(account._id, ipAddress, requestAgent);
      Object.assign(signInResponse, tokenPair);

      const secret: string = Buffer.from(state, "base64").toString("utf-8");
      const clientOrigin = this.configService.get<string>("CLIENT_ORIGIN");

      response.redirect(`${clientOrigin}/sign-in/callback?token=${sign({ secret, ...signInResponse }, secret, { expiresIn: 60 * 60 * 1000 })}`);
    } catch (error) {
      console.error("Error during Google Auth Callback:", error);
      response.status(500).send("Authentication failed");
    }
  }

  async signIn(payload: SignInRequestDto, ipAddress: string, requestAgent: RequestAgent): Promise<SignInResponseDto> {
    const { emailOrUserName, password } = payload;

    const account: Account = await this.find(
      { $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] },
      {
        select: ["_id", "password", "isActive"],
        force: true,
      },
    );

    if (!account || !compareSync(password, account.password)) {
      throw new UnauthorizedException(AccountErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    if (!account.isActive) {
      throw new UnauthorizedException(AccountErrorMessage.ACCOUNT_LOKED);
    }

    return this.generateTokenPair(account._id, ipAddress, requestAgent);
  }

  async signOut(sub: string): Promise<StatusResponseDto> {
    await this.jwtAccessService.revoke(sub);
    await this.jwtRefreshService.revoke(sub);

    return { message: "Sign out success" };
  }

  async signUp(data: SignUpRequestDto): Promise<Account> {
    return await withMutateTransaction<Account>(this.getModel(), async (session: ClientSession) => {
      const { email, password, ...profileInfo } = data;

      const hashedPassword: string = await this.hashPassword(password);

      const createdAccount: Account = await this.create(
        {
          email,
          password: hashedPassword,
        },
        { session },
      );

      await this.profileService.create({ account: createdAccount._id, ...profileInfo }, { session });

      this.mailerService.sendMail({
        subject: MailSubject.ACCOUNT_REGISTERD,
        to: createdAccount.email,
        template: "account-registered",
        context: {
          fullName: `${profileInfo.firstName} ${profileInfo.lastName}`,
        },
      });
      const { password: _, ...rawAcount }: Account = createdAccount.toObject();

      return {
        ...rawAcount,
        password: undefined,
      } as Account;
    });
  }

  async refreshToken(refreshToken: string, ipAddress: string, requestAgent: RequestAgent): Promise<RefreshTokenResponseDto> {
    const decodedToken: JwtPayload = this.jwtRefreshService.decodeToken(refreshToken);

    if (!decodedToken || !decodedToken.sub) throw new BadRequestException(AccountErrorMessage.INVALID_AUTH_TOKEN);

    const accountId: DocumentId = await this.jwtRefreshService.getUid(decodedToken.sub);

    if (!accountId) throw new BadRequestException(AccountErrorMessage.INVALID_AUTH_TOKEN);

    await this.jwtRefreshService.revoke(decodedToken.sub);

    return this.generateTokenPair(accountId, ipAddress, requestAgent);
  }

  async forgotPassword({ emailOrUserName }: ForgotPasswordDto, ipAddress: string): Promise<string> {
    const account = await this.find(
      {
        $or: [{ email: emailOrUserName }, { phone: emailOrUserName }],
      },
      {
        select: ["_id", "email"],
      },
    );

    if (!account) throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);

    const otpCode: string = this.generateOtp();
    const sessionId: string = uuid();
    const session: ResetPasswordSession = { accountId: account._id, otpCode, ipAddress };

    await this.cacheService.set(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId), session, OTP_TTL);

    await this.mailerService.sendMail({
      to: account.email,
      subject: MailSubject.RESET_PASSWORD,
      template: "reset-password",
      context: { account: account.userName, otpCode },
    });

    return sessionId;
  }

  async resetPassword(payload: ResetPasswordDto, ipAddress: string): Promise<StatusResponseDto> {
    const { newPassword, sessionId, otpCode } = payload;

    const session: ResetPasswordSession = await this.getCachedResetPasswordSession(sessionId);
    if (!session) throw new BadRequestException(AccountErrorMessage.INVALID_RESET_PASSWORD_SESSION);

    if (otpCode !== session.otpCode || ipAddress !== session.ipAddress) {
      throw new BadRequestException(AccountErrorMessage.INVALID_OTP);
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.update({ _id: session.accountId }, { password: hashedPassword });

    await this.revokeResetPasswordSession(sessionId);

    return { message: "Reset password success" };
  }

  async lockAccount(accountId: DocumentId, payload: LockAccountDto): Promise<StatusResponseDto> {
    const account: Account = await this.find(accountId, {
      select: ["_id", "password", "isActive"],
    });

    if (!account) {
      throw new UnauthorizedException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
    }

    if (!compareSync(payload.password, account.password)) {
      throw new UnauthorizedException(AccountErrorMessage.WRONG_PASSWORD);
    }

    await this.update(accountId, {
      isActive: false,
    });

    return { message: "Lock account success" };
  }

  async requestActivateAccount(payload: RequestActiveAccountDto, ipAddress: string): Promise<StatusResponseDto> {
    const { emailOrUserName } = payload;

    const account = await this.find({ $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] }, { select: ["_id", "email", "isActive"] });

    if (!account) {
      throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
    }

    if (account.isActive) {
      throw new BadRequestException(AccountErrorMessage.ACCOUNT_ALREADY_ACTIVE);
    }

    const clientUrl: string = this.configService.get<string>("CLIENT_ORIGIN");
    const sessionId: string = uuid();

    const session: ActivateAccountSession = { accountId: account._id, ipAddress };

    await this.cacheService.set(joinCacheKey(ACTIVATE_ACCOUNT_TRANSACTION_CACHE_PREFIX, sessionId), session, OTP_TTL);

    await this.mailerService.sendMail({
      to: account.email,
      subject: MailSubject.ACTIVE_ACCOUNT,
      template: "active-account",
      context: {
        account: account.userName,
        activeUrl: `${clientUrl}/account/activate?session=${sessionId}`,
      },
    });

    return { message: "Request active account success" };
  }

  async activateAccount(sessionId: string, ipAddress: string): Promise<boolean> {
    const session: ResetPasswordSession = await this.cacheService.get(joinCacheKey(ACTIVATE_ACCOUNT_TRANSACTION_CACHE_PREFIX, sessionId));

    if (!session) {
      throw new NotAcceptableException(AccountErrorMessage.INVALID_RESET_PASSWORD_SESSION);
    }

    if (ipAddress !== session.ipAddress) {
      throw new NotAcceptableException(AccountErrorMessage.DEVICE_INVALID);
    }

    await this.update(session.accountId, { isActive: true });

    await this.revokeResetPasswordSession(sessionId);

    return true;
  }

  /* Private helpers */

  private async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    return await hash(password, salt);
  }

  private generateTokenPair(accountId: DocumentId, ipAddress: string, requestAgent: RequestAgent): TokenPair {
    this.accessRecordService.create({
      account: accountId,
      ipAddress: ipAddress,
      browserName: requestAgent.browserInfo,
    });

    return {
      accessToken: this.jwtAccessService.generateToken(accountId),
      refreshToken: this.jwtRefreshService.generateToken(accountId),
    };
  }

  private async getCachedResetPasswordSession(sessionId: string): Promise<ResetPasswordSession> {
    return await this.cacheService.get(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId));
  }

  private async revokeResetPasswordSession(sessionId: string): Promise<void> {
    await this.cacheService.del(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId));
  }

  private generateOtp(): string {
    return Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
  }
}

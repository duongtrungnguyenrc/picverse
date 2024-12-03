import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { compareSync, genSalt, hash } from "bcrypt";
import { ClientSession, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";

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
import { Account } from "../schemas";

@Injectable()
export class AccountService extends Repository<Account> {
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
  }

  async signIn(payload: SignInRequestDto, ipAddress: string, requestAgent: RequestAgent): Promise<SignInResponseDto> {
    const { emailOrUserName, password } = payload;

    const account: Account = await this.find({ $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] }, ["_id", "password", "isActive"], undefined, true);

    if (!account || !compareSync(password, account.password)) {
      throw new UnauthorizedException(AccountErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    if (!account.isActive) {
      throw new UnauthorizedException(AccountErrorMessage.ACCOUNT_LOKED);
    }

    return this.generateTokenPair(account._id, ipAddress, requestAgent);
  }

  async signUp(data: SignUpRequestDto): Promise<void> {
    return withMutateTransaction(this.getModel(), async (session: ClientSession) => {
      const { email, userName, password, ...profileInfo } = data;

      const hashedPassword: string = await this.hashPassword(password);

      const createdAccount = await this.create(
        {
          email,
          userName,
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
      ["_id", ""],
    );

    if (!account) throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);

    const otpCode: string = this.generateOtp();
    const sessionId: string = uuid();
    const session: ResetPasswordSession = { accountId: account._id, otpCode, ipAddress };

    await this.cacheService.set(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId), session, OTP_TTL);

    await this.mailerService.sendMail({
      to: account.email,
      subject: MailSubject.RESET_PASSWORD,
      template: "forgot-password",
      context: { account: account.userName, otpCode },
    });

    return sessionId;
  }

  async resetPassword(payload: ResetPasswordDto, ipAddress: string): Promise<boolean> {
    const { newPassword, sessionId, otpCode } = payload;

    const session: ResetPasswordSession = await this.getCachedResetPasswordSession(sessionId);
    if (!session) throw new BadRequestException(AccountErrorMessage.INVALID_RESET_PASSWORD_SESSION);

    if (otpCode !== session.otpCode || ipAddress !== session.ipAddress) {
      throw new BadRequestException(AccountErrorMessage.INVALID_OTP);
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.update({ _id: session.accountId }, { password: hashedPassword });

    await this.revokeResetPasswordSession(sessionId);

    return true;
  }

  async lockAccount(accountId: DocumentId, payload: LockAccountDto): Promise<boolean> {
    const account: Account = await this.find(accountId, ["_id", "password", "isActive"]);

    if (!account) {
      throw new UnauthorizedException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
    }

    if (!compareSync(payload.password, account.password)) {
      throw new UnauthorizedException(AccountErrorMessage.WRONG_PASSWORD);
    }

    await this.update(accountId, {
      isActive: false,
    });

    return true;
  }

  async requestActivateAccount(payload: RequestActiveAccountDto, ipAddress: string): Promise<boolean> {
    const { emailOrUserName } = payload;

    const account = await this.find({ $or: [{ email: emailOrUserName }, { userName: emailOrUserName }] }, ["_id", "email", "isActive"]);

    if (!account) {
      throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
    }

    if (account.isActive) {
      throw new BadRequestException(AccountErrorMessage.ACCOUNT_ALREADY_ACTIVE);
    }

    const clientUrl: string = this.configService.get<string>("CLIENT_URL");
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

    return true;
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

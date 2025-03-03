import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ClientSession, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { compareSync } from "bcrypt";
import { v4 as uuid } from "uuid";

import {
  ChangePasswordRequestDto,
  ForgotPasswordDto,
  LockAccountDto,
  RequestActiveAccountDto,
  ResetPasswordDto,
  SignUpRequestDto,
  Account,
  MailSubject,
  AccountErrorMessage,
  AccountConfigDto,
  UpdateAccountConfigDto,
} from "../models";
import { ACTIVATE_ACCOUNT_TRANSACTION_CACHE_PREFIX, OTP_TTL, RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX } from "../constants";
import { generateOtp, hashPassword, Repository, withMutateTransaction } from "@common/utils";
import { CacheService, joinCacheKey } from "@modules/cache";
import { SessionService } from "@modules/session";
import { ProfileService } from "@modules/profile";
import { StatusResponseDto } from "@common/dtos";

@Injectable()
export class AccountService extends Repository<Account> {
  constructor(
    @InjectModel(Account.name) AccountModel: Model<Account>,

    private readonly mailerService: MailerService,
    private readonly profileService: ProfileService,
    private readonly sesisonService: SessionService,
    private readonly configService: ConfigService,
    cacheService: CacheService,
  ) {
    super(AccountModel, cacheService);
  }

  async signUp(data: SignUpRequestDto): Promise<StatusResponseDto> {
    return await withMutateTransaction<Account, StatusResponseDto>(this.getModel(), async (session: ClientSession) => {
      const { email, password, ...profileInfo } = data;

      const hashedPassword: string = await hashPassword(password);

      const createdAccount: Account = await this.create(
        {
          email,
          password: hashedPassword,
        },
        { session },
      );

      await this.profileService.create({ accountId: createdAccount._id, ...profileInfo }, { session });

      try {
        this.mailerService.sendMail({
          subject: MailSubject.ACCOUNT_REGISTERD,
          to: createdAccount.email,
          template: "account-registered",
          context: {
            fullName: `${profileInfo.firstName} ${profileInfo.lastName}`,
          },
        });
      } catch (error) {
        console.log("Send mail error: ", error);
      }

      return {
        message: "Sign up success",
      };
    });
  }

  async forgotPassword(payload: ForgotPasswordDto, ipAddress: string): Promise<string> {
    const { emailOrUserName } = payload;

    const account = await this.find(
      {
        $or: [{ email: emailOrUserName }, { phone: emailOrUserName }],
      },
      {
        select: ["_id", "email"],
      },
    );

    if (!account) throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);

    const otpCode: string = generateOtp();
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

    const hashedPassword = await hashPassword(newPassword);
    await this.update({ _id: session.accountId }, { password: hashedPassword });

    await this.revokeResetPasswordSession(sessionId);

    return { message: "Reset password success" };
  }

  async changePassword(accountId: DocumentId, sessionId: DocumentId, payload: ChangePasswordRequestDto): Promise<StatusResponseDto> {
    const { newPassword, oldPassword, revokeAllSessions } = payload;

    const account: Account = await this.find(accountId, {
      select: ["_id", "password"],
    });

    if (!account) {
      throw new BadRequestException(AccountErrorMessage.ACCOUNT_NOT_FOUND);
    }

    if (compareSync(newPassword, account.password)) {
      throw new NotAcceptableException(AccountErrorMessage.PASSWORD_CONFLICT);
    }

    if (!compareSync(oldPassword, account.password)) {
      throw new NotAcceptableException(AccountErrorMessage.WRONG_PASSWORD);
    }
    const hashedPassword = await hashPassword(newPassword);

    await this.update({ _id: accountId }, { password: hashedPassword });

    if (revokeAllSessions) {
      this.sesisonService.revokeAllSession(accountId, [sessionId]);
    }

    return { message: "Change password success" };
  }

  async updateConfig(accountId: DocumentId, payload: UpdateAccountConfigDto): Promise<StatusResponseDto> {
    await this.update(accountId, payload);

    return { message: "Update account config success" };
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

  async getAccount(accountId: DocumentId): Promise<Account> {
    return await this.find(accountId);
  }

  async getAccountConfig(accountId: DocumentId): Promise<AccountConfigDto> {
    const config: AccountConfigDto = await this.find(accountId, {
      select: ["_id", "isActive", "allowComment", "allowNotify", "allowEmail", "enable2FA", "inboxConfig"],
    });

    return config;
  }

  /* Private helpers */

  private async getCachedResetPasswordSession(sessionId: string): Promise<ResetPasswordSession> {
    return await this.cacheService.get(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId));
  }

  private async revokeResetPasswordSession(sessionId: string): Promise<void> {
    await this.cacheService.del(joinCacheKey(RESET_PASSOWRD_TRANSACTION_CACHE_PREFIX, sessionId));
  }
}

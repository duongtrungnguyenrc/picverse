import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compareSync, genSalt, hash } from "bcrypt";

import { SignInRequestDto, SignInResponseDto, SignUpRequestDto } from "../dtos";
import { JwtRefreshService } from "@modules/jwt-refresh";
import { JwtAccessService } from "@modules/jwt-access";
import { User, UserService } from "@modules/user";
import { ErrorMessage } from "@common/enums";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAccessService: JwtAccessService,
    private readonly jwtRefreshService: JwtRefreshService,
  ) {}

  async signIn({ email, password }: SignInRequestDto): Promise<SignInResponseDto> {
    const user: User = await this.userService.find({ email }, ["_id", "password"]);

    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedException(ErrorMessage.WRONG_EMAIL_OR_PASSWORD);
    }

    return this.generateTokenPair(user._id);
  }

  async signUp(data: SignUpRequestDto) {
    const { password, ...userInfo } = data;

    const hashedPassword: string = await this.hashPassword(password);

    return this.userService.create({
      ...userInfo,
      password: hashedPassword,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    return await hash(password, salt);
  }

  private generateTokenPair(userId: DocumentId): TokenPair {
    return {
      accessToken: this.jwtAccessService.generateToken(userId),
      refreshToken: this.jwtRefreshService.generateToken(userId),
    };
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

import { JwtAccessService } from "@modules/jwt-access";
import { getTokenFromRequest } from "@common/utils";
import { ErrorMessage } from "@common/enums";

@Injectable()
export class JWTAccessAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authToken: string = getTokenFromRequest(request);

      const payload: JwtPayload = await this.jwtAccessService.verify(authToken);

      if (!payload) throw new Error();

      const userId: DocumentId = await this.jwtAccessService.getUid(payload.sid);

      if (!userId) {
        throw new UnauthorizedException(ErrorMessage.TOKEN_EXPIRED);
      }

      request.user = {
        id: userId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
  }
}

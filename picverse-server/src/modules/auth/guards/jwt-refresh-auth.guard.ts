import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtRefreshService } from "@modules/jwt-refresh";
import { getTokenFromRequest } from "@common/utils";
import { ErrorMessage } from "@common/enums";

@Injectable()
export class JWTRefreshAuthGuard implements CanActivate {
  constructor(private readonly jwtRefreshService: JwtRefreshService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authToken = getTokenFromRequest(request);

      const payload: JwtPayload = await this.jwtRefreshService.verify(authToken);

      if (!payload) throw new Error();

      const userId: DocumentId = await this.jwtRefreshService.getUid(payload.sub);

      if (!userId) {
        throw new UnauthorizedException(ErrorMessage.TOKEN_EXPIRED);
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
  }
}

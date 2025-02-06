import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Observable } from "rxjs";

import { JwtAccessService } from "@modules/jwt-access";
import { getTokenFromHandshake } from "../utils";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class JWTSocketAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const authToken = getTokenFromHandshake(client.handshake);

    if (!authToken) throw new WsException("Unauthorized");

    Promise.resolve(this.jwtAccessService.verify(authToken)).catch(() => {
      throw new WsException("Invalid token");
    });

    return true;
  }
}

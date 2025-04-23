import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable, Subscriber } from "rxjs";
import { Socket } from "socket.io";

import { JwtAccessService } from "@modules/jwt-access";
import { getTokenFromHandshake } from "../utils";

@Injectable()
export class JWTSocketAuthGuard implements CanActivate {
  constructor(private readonly jwtAccessService: JwtAccessService) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const authToken = getTokenFromHandshake(client.handshake);

    return new Observable((subscriber) => {
      if (!authToken) return this.unauthorized(client, subscriber);

      this.jwtAccessService
        .verify(authToken)
        .then(() => subscriber.next(true))
        .catch(() => this.unauthorized(client, subscriber))
        .finally(() => subscriber.complete());
    });
  }

  private unauthorized(client: Socket, subscriber: Subscriber<boolean>) {
    client.emit("error", "Unauthorized");
    client.disconnect();
    subscriber.next(false);
    subscriber.complete();
  }
}

import { Handshake } from "socket.io/dist/socket-types";
import { UnauthorizedException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { decode } from "jsonwebtoken";
import { Socket } from "socket.io";
import { Request } from "express";

import { AccountErrorMessage } from "@modules/account";
import { TOKEN_TYPE } from "../constants";

const extractAuthToken = (fullToken: string, raw: boolean = false) => {
  const [tokenType, authToken] = fullToken?.split(" ") ?? [];

  if ((!tokenType || tokenType !== TOKEN_TYPE || !authToken) && !raw) {
    throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return authToken;
};

export const getTokenFromRequest = (request: Request, raw: boolean = false): string => {
  const fullToken = request.headers["authorization"];

  if (!fullToken && !raw) {
    if (request instanceof Request) throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
    throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return extractAuthToken(fullToken, raw);
};

export const getTokenFromHandshake = (handshake: Handshake, raw: boolean = false): string => {
  const fullToken: string = handshake.auth.token || handshake.headers.authorization;

  if (!fullToken) {
    throw new WsException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return extractAuthToken(fullToken, raw);
};

export const getSocketTokenPayload = (client: Socket, key: keyof JwtPayload) => {
  try {
    const authToken = getTokenFromHandshake(client.handshake, true);
    const decodedToken: JwtPayload = decode(authToken) as JwtPayload;

    return decodedToken?.[key];
  } catch (error) {
    return undefined;
  }
};

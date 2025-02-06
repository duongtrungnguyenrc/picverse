import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { Socket } from "socket.io";

import { getSocketTokenPayload, getTokenFromHandshake } from "@common/utils";

export const SocketAuthTokenPayload = (key: keyof JwtPayload): ParameterDecorator => {
  return createParamDecorator(async (_, context: ExecutionContext): Promise<string | number | DocumentId | undefined> => {
    const client: Socket = context.switchToWs().getClient();

    return getSocketTokenPayload(client, key);
  })();
};

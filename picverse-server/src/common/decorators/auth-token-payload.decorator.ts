import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { Request } from "express";

import { getTokenFromRequest } from "@common/utils";

export const AuthTokenPayload = (key: keyof JwtPayload): ParameterDecorator => {
  return createParamDecorator(async (_, ctx: ExecutionContext): Promise<string | number | DocumentId | undefined> => {
    const request: Request = ctx.switchToHttp().getRequest();

    const authToken: string = getTokenFromRequest(request, true);

    try {
      const decodedToken: JwtPayload = decode(authToken) as JwtPayload;

      return decodedToken?.[key];
    } catch (error) {
      return undefined;
    }
  })();
};

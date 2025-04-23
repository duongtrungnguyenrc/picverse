import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";
import { decode } from "jsonwebtoken";
import { Request } from "express";

import { getTokenFromRequest } from "@common/utils";

export const AuthUid = createParamDecorator(async (_, ctx: ExecutionContext): Promise<DocumentId | undefined> => {
  const request: Request = ctx.switchToHttp().getRequest();

  const authToken: string = getTokenFromRequest(request, true);

  try {
    const decodedToken: JwtPayload = decode(authToken) as JwtPayload;

    if (!isValidObjectId(decodedToken?.uid)) return undefined;

    return new Types.ObjectId(decodedToken?.uid);
  } catch (error) {
    return undefined;
  }
});

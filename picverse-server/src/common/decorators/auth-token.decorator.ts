import { getTokenFromRequest } from "@common/utils";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const AuthToken = createParamDecorator((_, ctx: ExecutionContext): string => {
  const request: Request = ctx.switchToHttp().getRequest();

  return getTokenFromRequest(request, true);
});

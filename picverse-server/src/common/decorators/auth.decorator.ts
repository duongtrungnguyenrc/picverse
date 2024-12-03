import { applyDecorators, CanActivate, Type, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";

import { JWTAccessAuthGuard } from "@common/guards";

export const Auth = (guard: Type<CanActivate> = JWTAccessAuthGuard) => {
  return applyDecorators(UseGuards(guard), ApiBearerAuth("Authorization"), ApiHeader({ name: "authorization", required: true, description: "Jwt Bearer token" }));
};

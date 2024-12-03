import { applyDecorators, CanActivate, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";

import { JWTAccessAuthGuard } from "@common/guards";

export const Auth = (guard: CanActivate | Function = JWTAccessAuthGuard) => {
  return applyDecorators(
    UseGuards(guard),
    ApiBearerAuth("Authorization"),
    ApiHeader({ name: "authorization", required: true, description: "Jwt Bearer token" }),
  );
};

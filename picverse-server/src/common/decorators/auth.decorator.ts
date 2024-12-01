import { applyDecorators, CanActivate, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";

import { JWTAccessAuthGuard } from "@modules/auth";

export type ValidRole = Role | "*";

export const Auth = (roles: ValidRole[] = ["*"], guard: CanActivate | Function = JWTAccessAuthGuard) => {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(guard),
    ApiBearerAuth("Authorization"),
    ApiHeader({ name: "authorization", required: true, description: "" }),
  );
};

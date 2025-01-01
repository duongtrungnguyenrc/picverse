import { Module } from "@nestjs/common";

import { AccountModule } from "@modules/account";
import { ProfileModule } from "@modules/profile";
import { SessionModule } from "@modules/session";
import { AuthController } from "./controllers";
import { AuthService } from "./services";

@Module({
  imports: [AccountModule, ProfileModule, SessionModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

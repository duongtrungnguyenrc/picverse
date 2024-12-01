import { Module } from "@nestjs/common";

import { AuthController } from "./controllers";
import { UserModule } from "@modules/user";
import { AuthService } from "./services";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

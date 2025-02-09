import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Account, AccountSchema } from "./models/schemas";
import { AccountController } from "./controllers";
import { ProfileModule } from "@modules/profile";
import { SessionModule } from "@modules/session";
import { AccountService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
    ProfileModule,
    SessionModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}

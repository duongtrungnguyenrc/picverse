import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { AccessRecord, AccessRecordSchema, Account, AccountSchema } from "./schemas";
import { AccessRecordService, AccountService } from "./services";
import { AccountController } from "./controllers";
import { ProfileModule } from "@modules/profile";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: AccessRecord.name,
        schema: AccessRecordSchema,
      },
    ]),
    ProfileModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccessRecordService],
})
export class AccountModule {}

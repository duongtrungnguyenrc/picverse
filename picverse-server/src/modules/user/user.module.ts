import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { User, UserSchema } from "./schemas";
import { UserService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

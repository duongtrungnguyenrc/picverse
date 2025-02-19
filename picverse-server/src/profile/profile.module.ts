import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from "@nestjs/common";

import { Profile, ProfileSchema } from "./models";
import { ProfileController } from "./controllers";
import { AccountModule } from "@modules/account";
import { ProfileService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
    forwardRef(() => AccountModule),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

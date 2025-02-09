import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Profile, ProfileSchema } from "./models";
import { ProfileController } from "./controllers";
import { ProfileService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

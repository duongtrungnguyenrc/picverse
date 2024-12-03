import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Profile, ProfileSchema } from "./schemas";
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
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}

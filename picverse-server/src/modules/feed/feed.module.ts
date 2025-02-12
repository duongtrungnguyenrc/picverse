import { Module } from "@nestjs/common";

import { FeedController } from "./controllers";
import { SocialModule } from "@modules/social";
import { PinModule } from "@modules/pin";
import { FeedService } from "./services";

@Module({
  imports: [PinModule, SocialModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}

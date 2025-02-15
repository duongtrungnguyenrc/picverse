import { Module } from "@nestjs/common";

import { FeedController } from "./controllers";
import { SocialModule } from "@modules/social";
import { PinModule } from "@modules/pin";
import { FeedService } from "./services";
import { VectorModule } from "@modules/vector";

@Module({
  imports: [PinModule, SocialModule, VectorModule],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}

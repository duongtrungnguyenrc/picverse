import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Pin, PinSchema, PinInteraction, PinInteractionSchema, Like, LikeSchema, Comment, CommentSchema } from "./models";
import { CommentService, PinInteractionService, PinService, LikeService } from "./services";
import { ModerationModule } from "@modules/moderation";
import { VectorModule } from "@modules/vector";
import { PinController } from "./controllers";
import { PinInteractionGateway } from "./gatewaies";
import { CloudModule } from "@modules/cloud";
import { SocialModule } from "@modules/social";
import { ProfileModule } from "@modules/profile";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pin.name, schema: PinSchema },
      { name: PinInteraction.name, schema: PinInteractionSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    VectorModule,
    CloudModule,
    ModerationModule,
    SocialModule,
    ProfileModule,
  ],
  controllers: [PinController],
  providers: [PinService, PinInteractionService, CommentService, LikeService, PinInteractionGateway],
  exports: [PinService, PinInteractionService],
})
export class PinModule {}

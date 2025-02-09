import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Pin, PinSchema, Tag, TagSchema, Like, LikeSchema, Comment, CommentSchema } from "./models";
import { CommentService, PinService } from "./services";
import { PinController } from "./controllers";
import { CommentGateway } from "./gatewies";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pin.name, schema: PinSchema },
      { name: Tag.name, schema: TagSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PinController],
  providers: [PinService, CommentService, CommentGateway],
})
export class PinModule {}

import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Board, BoardSchema, Pin, PinSchema, Tag, TagSchema, Like, LikeSchema, Comment, CommentSchema } from "./schemas";
import { PinController } from "./controllers";
import { PinService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: Pin.name, schema: PinSchema },
      { name: Tag.name, schema: TagSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PinController],
  providers: [PinService],
})
export class ContentModule {}

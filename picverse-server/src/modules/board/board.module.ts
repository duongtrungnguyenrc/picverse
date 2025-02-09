import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { BoardController } from "./controllers";
import { Board, BoardSchema } from "./models/schemas";
import { BoardService } from "./services";

@Module({
  imports: [MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}

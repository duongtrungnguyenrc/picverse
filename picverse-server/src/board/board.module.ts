import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Board, BoardSchema } from "./models/schemas";
import { BoardController } from "./controllers";
import { BoardService } from "./services";
import { AccountModule } from "@modules/account";

@Module({
  imports: [MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]), AccountModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}

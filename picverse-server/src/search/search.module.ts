import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { SearchRecord, SearchRecordSchema } from "./models";
import { SearchController } from "./controllers";
import { ProfileModule } from "@modules/profile";
import { SearchService } from "./services";
import { PinModule } from "@modules/pin";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SearchRecord.name,
        schema: SearchRecordSchema,
      },
    ]),
    PinModule,
    ProfileModule,
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}

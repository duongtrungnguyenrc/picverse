import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { AccessRecord, AccessRecordSchema, Session, SessionSchema } from "./schemas";
import { AccessRecordService, SessionService } from "./services";
import { ProfileModule } from "@modules/profile";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Session.name,
        schema: SessionSchema,
      },
      {
        name: AccessRecord.name,
        schema: AccessRecordSchema,
      },
    ]),
    ProfileModule,
  ],
  providers: [AccessRecordService, SessionService],
  exports: [AccessRecordService, SessionService],
})
export class SessionModule {}

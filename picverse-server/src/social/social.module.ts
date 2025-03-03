import { MongooseModule } from "@nestjs/mongoose";
import { forwardRef, Module } from "@nestjs/common";

import { Follow, FollowSchema, Notification, NotificationSchema } from "./models/schemas";
import { FollowService, NotificationService } from "./services";
import { ProfileModule } from "@modules/profile";
import { SocialController } from "./controllers";
import { SocialGateway } from "./gatewaies";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follow.name,
        schema: FollowSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    forwardRef(() => ProfileModule),
  ],
  controllers: [SocialController],
  providers: [FollowService, NotificationService, SocialGateway],
  exports: [NotificationService, FollowService],
})
export class SocialModule {}

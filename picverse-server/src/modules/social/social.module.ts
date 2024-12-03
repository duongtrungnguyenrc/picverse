import { Module } from "@nestjs/common";
import { FollowService, NotificationService } from "./services";
import { MongooseModule } from "@nestjs/mongoose";
import { Follow, FollowSchema, Notification, NotificationSchema } from "./schemas";

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
  ],
  providers: [FollowService, NotificationService],
  exports: [FollowService, NotificationService],
})
export class SocialModule {}

import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CreateNotificationDto } from "../dtos";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Notification } from "../schemas";

@Injectable()
export class NotificationService extends Repository<Notification> {
  constructor(@InjectModel(Notification.name) NotificationModel: Model<Notification>, cacheService: CacheService) {
    super(NotificationModel, cacheService);

    // admin.initializeApp({
    //   credential: admin.credential.cert({
    //     projectId: "PROJECT_ID",
    //     clientEmail: "CLIENT_EMAIL",
    //     privateKey: "PRIVATE_KEY",
    //   }),
    // });
  }

  async sendNotification(notification: CreateNotificationDto): Promise<void> {
    // create and handle push noti
  }
}

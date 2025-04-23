import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CreateNotificationDto } from "../models";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Notification } from "../models/schemas";
import { SocialGateway } from "../gatewaies";

@Injectable()
export class NotificationService extends Repository<Notification> {
  constructor(
    @InjectModel(Notification.name) NotificationModel: Model<Notification>,
    cacheService: CacheService,
    private readonly socialGateway: SocialGateway,
  ) {
    super(NotificationModel, cacheService);
  }

  async sendNotification(notification: CreateNotificationDto): Promise<void> {
    this.socialGateway.server.to(notification.to.toString()).emit("notification", notification);
  }
}

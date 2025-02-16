import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { ENotificationType, NotificationService } from "@modules/social";
import { ProfileService } from "@modules/profile";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { PinInteraction } from "../models";
import { PinService } from "./pin.service";

@Injectable()
export class PinInteractionService extends Repository<PinInteraction> {
  constructor(
    @InjectModel(PinInteraction.name) commentModel: Model<PinInteraction>,
    cacheService: CacheService,
    private readonly notificationService: NotificationService,
    private readonly pinService: PinService,
    private readonly profileService: ProfileService,
  ) {
    super(commentModel, cacheService);
  }

  async createInteraction(payload: Partial<Omit<PinInteraction, "createdAt">>) {
    return await this.create(payload).finally(async () => {
      const { authorId } = await this.pinService.find(payload.pinId, { select: "authorId" });
      const profile = await this.profileService.find({ accountId: authorId }, { select: ["firstName", "lastName"] });

      this.notificationService.sendNotification({
        to: authorId,
        from: payload.accountId,
        type: ENotificationType.INTERACTION,
        message: `${profile?.firstName} ${profile?.lastName} ${payload.type.toLowerCase()}ed your pin`,
      });
    });
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Repository } from "@common/utils";
import { Model } from "mongoose";

import { StatusResponseDto } from "@common/dtos";
import { CacheService } from "@modules/cache";
import { CreatePinDto, UpdatePinDto } from "../dtos";
import { Pin } from "../schemas";

@Injectable()
export class PinService extends Repository<Pin> {
  constructor(@InjectModel(Pin.name) pinModel: Model<Pin>, cacheService: CacheService) {
    super(pinModel, cacheService, Pin.name);
  }

  async createPin(profileId: DocumentId, payload: CreatePinDto): Promise<StatusResponseDto> {
    await this.create({ ...payload, profileId });

    return { message: "Pin created success" };
  }

  async updatePin(profileId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, profileId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }
}

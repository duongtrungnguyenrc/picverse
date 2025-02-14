import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Repository } from "@common/utils";
import { Model } from "mongoose";

import { CloudService, Resource } from "@modules/cloud";
import { CreatePinDto, UpdatePinDto } from "../models";
import { StatusResponseDto } from "@common/dtos";
import { CacheService } from "@modules/cache";
import { Pin } from "../models";

@Injectable()
export class PinService extends Repository<Pin> {
  constructor(
    @InjectModel(Pin.name) pinModel: Model<Pin>,
    cacheService: CacheService,
    private readonly cloudService: CloudService,
  ) {
    super(pinModel, cacheService, Pin.name);
  }

  async createPin(accountId: DocumentId, file: Express.Multer.File, payload: CreatePinDto): Promise<StatusResponseDto> {
    const uploadedResource: Resource = await this.cloudService.uploadFile(
      accountId,
      file,
      {
        fileName: payload.title,
      },
      undefined,
      true,
    );

    await this.create({ ...payload, authorId: accountId, resource: uploadedResource._id });

    return { message: "Pin created success" };
  }

  async updatePin(accountId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }

  async getAllPins(accountId: DocumentId): Promise<Pin[]> {
    return await this._model.find({ accountId }).exec();
  }

  async deletePin(accountId: DocumentId, pinId: DocumentId): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });
    if (!pin) throw new NotFoundException("Pin not found for your profile");
    await this._model.deleteOne({ _id: pinId });
    return { message: "Pin deleted successfully" };
  }
}

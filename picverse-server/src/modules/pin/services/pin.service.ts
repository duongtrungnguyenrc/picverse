import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Repository } from "@common/utils";
import { randomUUID } from "crypto";
import { Model } from "mongoose";

import { CloudService, Resource } from "@modules/cloud";
import { CreatePinDto, UpdatePinDto } from "../models";
import { StatusResponseDto } from "@common/dtos";
import { VectorService } from "@modules/vector";
import { CacheService } from "@modules/cache";
import { Pin } from "../models";

@Injectable()
export class PinService extends Repository<Pin> {
  constructor(
    @InjectModel(Pin.name) pinModel: Model<Pin>,
    cacheService: CacheService,
    private readonly cloudService: CloudService,
    private readonly vectorService: VectorService,
    private readonly configService: ConfigService,
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

    const textEmbedding: number[] = await this.vectorService.generateTextEmbedding(payload.title, payload.description, payload.tags);
    const imageEmbedding = await this.vectorService.generateImageEmbedding(`${this.configService.get<string>("FILE_DOWNLOAD_URL")}/${uploadedResource._id}`);

    const vectorId: string = randomUUID();

    const createdPin = await this.create({ ...payload, authorId: accountId, resource: uploadedResource._id, vectorId, textEmbedding, imageEmbedding });

    try {
      await this.vectorService.insertEmbedding(PinService.name, createdPin.vectorId, textEmbedding, imageEmbedding);
    } catch (error) {
      console.log(error);
    }

    return { message: "Pin created success" };
  }

  async updatePin(accountId: DocumentId, pinId: DocumentId, payload: UpdatePinDto): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });

    if (!pin) throw new NotFoundException("Pin not found for your profile");

    await this.update(pin._id, payload);

    return { message: "Pin updated success" };
  }

  async getAllPins(accountId: DocumentId): Promise<Array<Pin>> {
    return await this._model.find({ accountId }).exec();
  }

  // async getSimilarPins(pinId: string, limit = 10): Promise<Pin[]> {
  //   const pin = await this.find(pinId, { select: "vectorId" });
  //   if (!pin) throw new NotFoundException("Pin not found");

  //   const similarPinIds = await this.vectorService.searchSimilar("pin_collection", [pin.vectorId], limit);
  //   return this._model.find({ vectorId: { $in: similarPinIds.map((s) => s.id) } });
  // }

  async deletePin(accountId: DocumentId, pinId: DocumentId): Promise<StatusResponseDto> {
    const pin = await this.exists({ _id: pinId, accountId });
    if (!pin) throw new NotFoundException("Pin not found for your profile");
    await this._model.deleteOne({ _id: pinId });
    return { message: "Pin deleted successfully" };
  }
}

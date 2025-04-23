import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { AccessRecord } from "../models";

@Injectable()
export class AccessRecordService extends Repository<AccessRecord> {
  constructor(@InjectModel(AccessRecord.name) AccessRecordModel: Model<AccessRecord>, cacheService: CacheService) {
    super(AccessRecordModel, cacheService);
  }
}

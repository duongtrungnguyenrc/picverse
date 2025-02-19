import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ACCESS_TOKEN_CACHE_PREFIX, ACCESS_TOKEN_SUB_TTL } from "../constants";
import { CacheService } from "@modules/cache";
import { JwtHandler } from "@common/utils";

@Injectable()
export class JwtAccessService extends JwtHandler {
  constructor(jwtService: JwtService, cacheService: CacheService) {
    super(jwtService, cacheService, ACCESS_TOKEN_CACHE_PREFIX, ACCESS_TOKEN_SUB_TTL);
  }
}

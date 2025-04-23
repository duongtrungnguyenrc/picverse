import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { REFRESH_TOKEN_CACHE_PREFIX, REFRESH_TOKEN_SUB_TTL } from "../constants";
import { CacheService } from "@modules/cache";
import { JwtHandler } from "@common/utils";

@Injectable()
export class JwtRefreshService extends JwtHandler {
  constructor(jwtService: JwtService, cacheService: CacheService) {
    super(jwtService, cacheService, REFRESH_TOKEN_CACHE_PREFIX, REFRESH_TOKEN_SUB_TTL);
  }
}

import { JwtService } from "@nestjs/jwt";
import { v4 as uuid } from "uuid";

import { CacheService, joinCacheKey } from "@modules/cache";

export class JwtHandler {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly cachePrefix: string,
    private readonly ttl?: number,
  ) {}

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token);
  }

  generateToken(uid: DocumentId): string {
    const sid: string = uuid();

    this.cacheService.set(joinCacheKey(this.cachePrefix, sid), uid, this.ttl);

    return this.jwtService.sign({
      sub: sid,
    });
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verify<JwtPayload>(token);
  }

  async getUid(sid: string): Promise<DocumentId> {
    return await this.cacheService.get<DocumentId>(joinCacheKey(this.cachePrefix, sid));
  }
}

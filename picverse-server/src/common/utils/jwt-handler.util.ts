import { JwtService } from "@nestjs/jwt";

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

  generateToken(payload: JwtSessionPayload): string {
    this.cacheService.set(joinCacheKey(this.cachePrefix, payload.sid), payload.uid, this.ttl);

    return this.jwtService.sign(payload);
  }

  async verify(token: string): Promise<JwtPayload> {
    return this.jwtService.verify<JwtPayload>(token);
  }

  async revoke(sid: string): Promise<void> {
    await this.cacheService.del(joinCacheKey(this.cachePrefix, sid));
  }

  async getUid(sid: string): Promise<DocumentId> {
    return await this.cacheService.get<DocumentId>(joinCacheKey(this.cachePrefix, sid));
  }
}

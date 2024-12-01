import { ConfigService } from "@nestjs/config";
import { Provider } from "@nestjs/common";
import KeyvRedis from "@keyv/redis";
import Keyv from "keyv";

export const CACHE_PROVIDE = "CACHE_PROVIDE";

export const getCacheProvider = (namespace: string = "root") => {
  const cacheProvider: Provider = {
    provide: CACHE_PROVIDE,
    useFactory: (configService: ConfigService) => {
      const redisUrl: string = configService.get<string>("REDIS_URL");
      const ttl: number = Number(configService.get<number>("REDIS_TTL")) || 3600;

      return new Keyv({
        store: new KeyvRedis(redisUrl),
        namespace: namespace,
        ttl: ttl,
      });
    },
    inject: [ConfigService],
  };

  return cacheProvider;
};

import { DynamicModule, Module, Provider } from "@nestjs/common";

import { getCacheProvider, CACHE_PROVIDE } from "./providers";
import { CacheService } from "./services";

@Module({})
export class CacheModule {
  static forRoot(): DynamicModule {
    const CacheProvider: Provider = getCacheProvider();

    return {
      module: CacheModule,
      providers: [CacheProvider, CacheService],
      global: true,
      exports: [CACHE_PROVIDE, CacheService],
    };
  }

  static forFeature(namespace: string): DynamicModule {
    const CacheProvider: Provider = getCacheProvider(namespace);

    return {
      module: CacheModule,
      providers: [CacheProvider, CacheService],
      exports: [CACHE_PROVIDE, CacheService],
    };
  }
}

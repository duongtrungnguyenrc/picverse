import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { CacheModule } from "@modules/cache/cache.module";
import { AuthModule } from "@modules/auth/auth.module";
import { UserModule } from "@modules/user/user.module";
import { JwtAccessModule } from "@modules/jwt-access";
import { JwtRefreshModule } from "@modules/jwt-refresh";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.forRoot(),
    AuthModule,
    UserModule,
    JwtAccessModule,
    JwtRefreshModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

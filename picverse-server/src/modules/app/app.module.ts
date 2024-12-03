import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { CacheModule } from "@modules/cache/cache.module";
import { AccountModule } from "@modules/account";
import { JwtRefreshModule } from "@modules/jwt-refresh";
import { JwtAccessModule } from "@modules/jwt-access";
import { ProfileModule } from "@modules/profile";
import { MailModule } from "@modules/mailer";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.forRoot(),
    MailModule,
    AccountModule,
    ProfileModule,
    JwtAccessModule,
    JwtRefreshModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

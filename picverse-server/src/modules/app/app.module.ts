import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { AccountModule } from "@modules/accounts";
import { JwtRefreshModule } from "@modules/jwt-refresh";
import { JwtAccessModule } from "@modules/jwt-access";
import { ProfileModule } from "@modules/profile";
import { MailModule } from "@modules/mailer";
import { CacheModule } from "@modules/cache";
import { SocialModule } from "@modules/social";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
          replicaSet: configService.get<string>("MONGO_REPLICA_SET"),
          readPreference: "secondaryPreferred",
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.forRoot(),
    JwtAccessModule,
    JwtRefreshModule,
    MailModule,
    AccountModule,
    ProfileModule,
    SocialModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

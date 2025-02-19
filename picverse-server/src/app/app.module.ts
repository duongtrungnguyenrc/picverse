import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { AccountModule } from "@modules/account";
import { JwtRefreshModule } from "@modules/jwt-refresh";
import { JwtAccessModule } from "@modules/jwt-access";
import { ProfileModule } from "@modules/profile";
import { MailModule } from "@modules/mailer";
import { CacheModule } from "@modules/cache";
import { SocialModule } from "@modules/social";
import { CloudModule } from "@modules/cloud";
import { AuthModule } from "@modules/auth";
import { BoardModule } from "@modules/board";
import { PinModule } from "@modules/pin";
import { ChatModule } from "@modules/chat";
import { FeedModule } from "@modules/feed";
import { VectorModule } from "@modules/vector";
import { SearchModule } from "@modules/search";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
          replicaSet: configService.get<string>("MONGO_REPLICA_SET"),
          readPreference: configService.get<string>("MONGO_READ_PREFERENCE") as any,
          dbName: configService.get<string>("MONGO_PRIMARY_NAME"),
        };
      },
      inject: [ConfigService],
    }),
    VectorModule,
    CacheModule.forRoot(),
    JwtAccessModule,
    JwtRefreshModule,
    MailModule,
    AccountModule,
    AuthModule,
    ProfileModule,
    SocialModule,
    CloudModule,
    BoardModule,
    PinModule,
    ChatModule,
    FeedModule,
    SearchModule,
  ],
})
export class AppModule {}

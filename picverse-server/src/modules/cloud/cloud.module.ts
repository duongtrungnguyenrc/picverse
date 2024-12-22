import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { CloudCredentials, CloudCredentialsSchema, CloudStorage, CloudStorageSchema, Resource, ResourceSchema } from "./schemas";
import { DriveStorageService, DropboxStorageService, LocalStorageService, CloudService } from "./services";
import { CloudStorageController } from "./controllers";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: "cloud",
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>("MONGO_URI"),
          replicaSet: configService.get<string>("MONGO_REPLICA_SET"),
          readPreference: configService.get<string>("MONGO_READ_PREFERENCE") as any,
          dbName: configService.get<string>("MONGO_CLOUD_NAME"),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: CloudStorage.name,
        schema: CloudStorageSchema,
      },
      {
        name: CloudCredentials.name,
        schema: CloudCredentialsSchema,
      },
      {
        name: Resource.name,
        schema: ResourceSchema,
      },
    ]),
  ],
  providers: [CloudService, DropboxStorageService, DriveStorageService, LocalStorageService],
  controllers: [CloudStorageController],
  exports: [CloudService],
})
export class CloudModule {}

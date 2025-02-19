import { QdrantClient } from "@qdrant/js-client-rest";
import { ConfigService } from "@nestjs/config";

export const QdrantConnectionProvider = {
  provide: "QDRANT_DB",
  useFactory: (configService: ConfigService) => {
    return new QdrantClient({ url: configService.get<string>("QDRANT_CONNECTION_URL") });
  },
  inject: [ConfigService],
};

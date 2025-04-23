import { Module } from "@nestjs/common";

import { VectorService } from "./services";
import { QdrantConnectionProvider } from "./providers";

@Module({
  providers: [QdrantConnectionProvider, VectorService],
  exports: [VectorService],
})
export class VectorModule {}

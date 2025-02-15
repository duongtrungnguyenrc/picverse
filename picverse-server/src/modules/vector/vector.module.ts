import { Module } from "@nestjs/common";

import { VectorService } from "./services";

@Module({
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}

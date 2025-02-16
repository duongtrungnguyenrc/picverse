import { Module } from "@nestjs/common";

import { ImageModerationService, TextModerationService } from "./services";

@Module({
  providers: [TextModerationService, ImageModerationService],
  exports: [TextModerationService, ImageModerationService],
})
export class ModerationModule {}

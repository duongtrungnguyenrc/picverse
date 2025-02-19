import { ImageClassificationPipeline, ImageClassificationOutput } from "@xenova/transformers";
import { Injectable, OnModuleInit } from "@nestjs/common";

import { IMAGE_BANNED_LABELS, MIN_MODERATE_SCORE } from "../constants";
import { IModerationService } from "../models";

@Injectable()
export class ImageModerationService implements IModerationService, OnModuleInit {
  private classifier: ImageClassificationPipeline;

  async onModuleInit() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;

    this.classifier = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
  }

  async moderateContent(imageUrl: string): Promise<string[] | null> {
    const result: ImageClassificationOutput = (await this.classifier(imageUrl)) as ImageClassificationOutput;

    const flaggedLabels = result
      .filter((res) => IMAGE_BANNED_LABELS.some((tag) => res.label.toLowerCase().includes(tag)) && res.score > MIN_MODERATE_SCORE)
      .map((res) => res.label);

    return flaggedLabels.length > 0 ? flaggedLabels : null;
  }
}

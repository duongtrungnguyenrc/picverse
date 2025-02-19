import { TextClassificationOutput, TextClassificationPipeline } from "@xenova/transformers";
import { Injectable, OnModuleInit } from "@nestjs/common";

import { MIN_MODERATE_SCORE } from "../constants";
import { IModerationService } from "../models";

@Injectable()
export class TextModerationService implements IModerationService, OnModuleInit {
  private classifier: TextClassificationPipeline;

  async onModuleInit() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;

    this.classifier = await pipeline("text-classification", "Xenova/toxic-bert");
  }

  async moderateContent(content: string): Promise<string[] | null> {
    const result: TextClassificationOutput = (await this.classifier(content)) as TextClassificationOutput;

    const flaggedLabels = result.filter((res) => res.score > MIN_MODERATE_SCORE).map((res) => res.label.replace("_", ""));

    return flaggedLabels.length > 0 ? flaggedLabels : null;
  }
}

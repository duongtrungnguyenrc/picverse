import { FeatureExtractionPipeline, ImageFeatureExtractionPipeline } from "@xenova/transformers";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { QdrantClient } from "@qdrant/js-client-rest";

import { multerToBlobUrl } from "@common/utils";

@Injectable()
export class VectorService implements OnModuleInit {
  private textEmbedder: FeatureExtractionPipeline;
  private imageEmbedder: ImageFeatureExtractionPipeline;

  constructor(@Inject("QDRANT_DB") private readonly client: QdrantClient) {}

  async onModuleInit() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;

    this.textEmbedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    this.imageEmbedder = await pipeline("image-feature-extraction", "Xenova/clip-vit-base-patch16");
  }

  async generateTextEmbedding(title: string, description: string, tags: string[]): Promise<number[]> {
    const text = `${title} ${description} ${tags?.join(" ")}`;
    const output = await this.textEmbedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }

  async generateImageEmbedding(urlOrMulterFile: string | Express.Multer.File): Promise<number[]> {
    if (typeof urlOrMulterFile != "string") {
      const url: string = multerToBlobUrl(urlOrMulterFile);

      return await this.generateImageEmbedding(url).then((res) => {
        URL.revokeObjectURL(url);
        return res;
      });
    }

    const output = await this.imageEmbedder(urlOrMulterFile);

    return Array.from(output.data).slice(0, 384);
  }

  async insertEmbedding(collectionName: string, id: string, textEmbedding: number[], imageEmbedding: number[]) {
    await this.verifyCollection(collectionName);

    return this.client.upsert(collectionName, {
      points: [
        {
          id,
          vector: {
            text_vector: textEmbedding,
            image_vector: imageEmbedding,
          },
        },
      ],
    });
  }

  async searchSimilar(collectionName: string, textEmbedding?: number[], imageEmbedding?: number[], limit = 10) {
    await this.verifyCollection(collectionName);

    const queries = {
      searches: [],
    };

    if (textEmbedding) {
      queries.searches.push({ vector: { name: "text_vector", vector: textEmbedding }, limit });
    }
    if (imageEmbedding) {
      queries.searches.push({ vector: { name: "image_vector", vector: imageEmbedding }, limit });
    }

    const results = await this.client.searchBatch(collectionName, queries);
    return this.mergeResults(results);
  }

  private mergeResults(results) {
    const scoreMap = new Map();

    let minScore = Infinity;
    let maxScore = -Infinity;

    results.forEach((result) => {
      result.forEach(({ id, score }) => {
        if (score < minScore) minScore = score;
        if (score > maxScore) maxScore = score;
        scoreMap.set(id, (scoreMap.get(id) || 0) + score);
      });
    });

    scoreMap.forEach((score, id) => {
      const normalizedScore = (score - minScore) / (maxScore - minScore);
      scoreMap.set(id, normalizedScore);
    });

    return Array.from(scoreMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => ({ id }));
  }

  private async verifyCollection(collectionName: string) {
    const collections = await this.client.getCollections();
    if (!collections.collections.some((c) => c.name === collectionName)) {
      await this.client.createCollection(collectionName, {
        vectors: {
          text_vector: { size: 384, distance: "Cosine", on_disk: true },
          image_vector: { size: 384, distance: "Cosine", on_disk: true },
        },
        hnsw_config: { m: 16, ef_construct: 200, on_disk: true },
      });
    }
  }
}

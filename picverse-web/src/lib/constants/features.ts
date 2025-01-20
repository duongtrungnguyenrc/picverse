import { Eraser, Undo, PaintBucket, Scissors, Palette, Replace } from "lucide-react";

export const transformationFeatures: Record<CldTransformationFeatureKey, CldTransformationFeature> = {
  restore: {
    key: "restore",
    title: "Restore image",
    subTitle: "Refine images by removing noise and imperfections",
    config: { restore: true },
    icon: Undo,
  },
  fillBackground: {
    key: "fillBackground",
    title: "Generative fill",
    subTitle: "Enhance an image's dimensions using AI outpainting",
    config: { fillBackground: true },
    icon: PaintBucket,
  },
  removeBackground: {
    key: "removeBackground",
    title: "Background remove",
    subTitle: "Removes the background of the image using AI",
    config: { removeBackground: true },
    icon: Eraser,
  },
  remove: {
    key: "remove",
    title: "Object remove",
    subTitle: "Identify and eliminate objects from images",
    config: {
      remove: { prompt: "", removeShadow: true, multiple: true },
    },
    icon: Scissors,
  },
  recolor: {
    key: "recolor",
    title: "Object recolor",
    subTitle: "Identify and recolor objects from the image",
    config: {
      recolor: { prompt: "", to: "", multiple: true },
    },
    icon: Palette,
  },
  replace: {
    key: "replace",
    title: "Object replace",
    subTitle: "Identify and replace objects from the image",
    config: {
      replace: {
        from: "",
        to: "",
        preserveGeometry: true,
      },
    },
    icon: Replace,
  },
};

export const aspectRatioOptions: Record<AspectRatioKey, { label: string; width: number; height: number }> = {
  "1:1": { label: "Square (1:1)", width: 1000, height: 1000 },
  "3:4": { label: "Standard Portrait (3:4)", width: 1000, height: 1334 },
  "9:16": { label: "Phone Portrait (9:16)", width: 1000, height: 1778 },
};

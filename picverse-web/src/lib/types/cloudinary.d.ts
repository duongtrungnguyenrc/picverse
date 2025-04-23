declare type CloudinaryImage = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
};

declare type AspectRatioKey = "1:1" | "3:4" | "9:16";

declare type CldTransformationFeatureKey =
  | "restore"
  | "remove"
  | "recolor"
  | "replace"
  | "removeBackground"
  | "fillBackground";

declare type CldTransformationFeature = {
  key: CldTransformationFeatureKey;
  title: string;
  subTitle: string;
  config: Object;
  icon: any;
};

type CldTransformFormType = {
  aspectRatio?: AspectRatioKey;
  prompt?: string;
  from?: string;
  to?: string;
  multiple?: boolean;
};

type CldTransformState = "default" | "transforming" | "transformed" | "error";

declare type CldTransformationConfig = {
  restore?: boolean;
  replace?: [string, string];
  remove?: {
    prompt: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
  fillBackground?: boolean;
};

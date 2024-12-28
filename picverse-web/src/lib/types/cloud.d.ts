declare type ECloudStorage = import("../enums").ECloudStorage;

declare type CloudStorage = BaseModel &
  TimeStampModel & {
    accountId: string;
    totalSpace: number; // byte
    usedSpace: number;
  };

declare type CloudCredential = BaseModel &
  TimeStampModel & {
    accountId: string;
    storage: import("../enums").ECloudStorage;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };

declare type Resource = BaseModel & {
  accountId: string;
  referenceId: string;
  parentId: string;
  name: string;
  type: import("../enums").EResourceType;
  storage: ECloudStorage;
  size: number;
  mimeType: string;
  isPrivate: boolean;
};

declare type GetResourcesResponse = InfiniteResponse<Resource>;

declare type UploadFileRequest = {
  file: File;
  fileName?: string;
  storage?: ECloudStorage;
};

declare type CreateFolderRequest = {
  name: string;
  storage: ECloudStorage;
};

declare type UpdateResourceRequest = {
  id: string;
  name?: string;
  parentId?: string;
  isPrivate?: boolean;
};

declare type GetExternalStorageLinkStatus = Record<ECloudStorage, boolean>;

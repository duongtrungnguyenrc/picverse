declare namespace CloudModule {
  declare type StorageRefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };

  declare type StorageAuthCallbackResponse = {
    accountId: DocumentId;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };

  declare type CloudAuthState = {
    accountId: DocumentId;
  };

  declare type UploadFileResult = {
    accountId: DocumentId;
    fileName: string;
    mimeType: string;
    size: number;
  };
}

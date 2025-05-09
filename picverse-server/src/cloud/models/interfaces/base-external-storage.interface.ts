import { IStorageService } from "./base-cloud-storage.interface";
import { CloudCredentials, ECloudStorage } from "..";

export interface IExternalStorageService extends IStorageService {
  getAuthUrl(accountId: DocumentId): string | Promise<string>;
  handleAuthCallback(code: string, state: string): Promise<CloudModule.StorageAuthCallbackResponse>;
  refreshAuthToken(credentials: CloudCredentials): Promise<CloudModule.StorageRefreshTokenResponse>;
  getValidAccessToken(accountId: DocumentId, provider: ECloudStorage): Promise<string>;
}

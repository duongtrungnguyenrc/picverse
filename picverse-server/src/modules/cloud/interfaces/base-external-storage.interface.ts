import { IStorageService } from "./base-cloud-storage.interface";
import { CloudCredentialsDocument } from "../schemas";
import { ECloudStorage } from "../enums";

export interface IExternalStorageService extends IStorageService {
  getAuthUrl(accountId: DocumentId): string | Promise<string>;
  handleAuthCallback(code: string, state: string): Promise<CloudModule.StorageAuthCallbackResponse>;
  refreshAuthToken(credentials: CloudCredentialsDocument): Promise<CloudModule.StorageRefreshTokenResponse>;
  getValidAccessToken(accountId: DocumentId, provider: ECloudStorage): Promise<string>;
}

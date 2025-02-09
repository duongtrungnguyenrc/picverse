declare type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

declare type ResetPasswordSession = {
  accountId: DocumentId | DocumentId;
  otpCode: string;
  ipAddress: string;
};

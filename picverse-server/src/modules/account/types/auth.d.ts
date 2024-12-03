declare type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

declare type ResetPasswordSession = {
  accountId: string | DocumentId;
  otpCode: string;
  ipAddress: string;
};

declare type ActivateAccountSession = {
  accountId: string | DocumentId;
  ipAddress: string;
};

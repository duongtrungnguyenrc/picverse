type AuthContext = {
  account?: Account;
  ready: boolean;
  authorizeClient: (actions?: { onSuccess?: VoidFunction; onFailed?: VoidFunction }) => Promise<void> | void;
  clearAuth: VoidFunction;
};

declare type Require2FAResponse = {
  accountId: string;
  require2FA: boolean;
};

declare type Verify2FARequest = {
  otpCode: string;
};

declare type Disable2FARequest = {
  otpCode: string;
  password: string;
};

declare type SignInRequest = {
  emailOrUserName: string;
  password: string;
};

type SignInWithTwoFactorRequest = {
  accountId: string;
  otpCode: string;
};

declare type ThirdPartyTokenPayload = TokenPair & {
  secret: string;
};

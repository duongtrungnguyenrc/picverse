type AuthContextType = {
  account?: Account;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  accessToken?: string;
  refreshToken?: string;
};

declare type Auth = Partial<TokenPair> & {
  account?: Account;
};

declare type Require2FAResponse = {
  accountId: string;
  profileId: string;
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
  profileId: string;
  otpCode: string;
};

declare type ThirdPartyTokenPayload = TokenPair & {
  secret: string;
};

declare type Account = BaseModel &
  TimeStampModel & {
    email: string;
    userName: string;
    allowNotify: boolean;
    allowEmail: boolean;
    enableTwoFactorAuthentication: boolean;
    isActive: boolean;
    createdAt: Date;
  };

type AuthContext = {
  account?: Pick<Account, "_id">;
  ready: boolean;
  authorizeClient: VoidFunction;
  clearAuth: VoidFunction;
};

declare type SignInDto = {
  emailOrUserName: string;
  password: string;
};

declare type SignUpDto = {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  birth: string;
  gender: import("../enums").EGender;
  phone: string;
};

declare type ThirdPartyTokenPayload = TokenPair & {
  secret: string;
};

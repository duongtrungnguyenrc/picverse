declare type Account = BaseModel &
  TimeStampModel & {
    email: string;
    userName: string;
    allowNotify: boolean;
    allowEmail: boolean;
    enable2FA: boolean;
    isActive: boolean;
    createdAt: Date;
  };

declare type MutatePassword<T> = T & {
  confirmPassword: string;
};

declare type SignUpRequest = {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  birth: string;
  gender: import("../enums").EGender;
  phone: string;
};

declare type UpdateAccountRequest = {
  email?: string;
  enable2FA?: boolean;
  allowNotify?: boolean;
  allowEmail?: boolean;
};

declare type ForgotPasswordRequest = {
  emailOrUserName: string;
};

declare type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  revokeAllSessions: boolean;
};

declare type ResetPasswordRequest = {
  otpCode: string;
  sessionId: string;
  newPassword: string;
};

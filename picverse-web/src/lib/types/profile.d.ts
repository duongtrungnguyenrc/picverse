declare type EGender = import("../enums").EGender;

declare type Profile = BaseModel &
  TimeStampModel & {
    accountId: string;
    firstName: string;
    lastName: string;
    birth: string;
    gender: EGender;
    phone: string;
    avatar: string;
    bio: string;
    isPublic: string;
  };

declare type ProfileDetail = Profile & {
  email: string;
  isFollowed?: boolean;
  isOwnProfile?: boolean;
};

declare type UpdateProfileRequest = Partial<Omit<Profile, "account">>;

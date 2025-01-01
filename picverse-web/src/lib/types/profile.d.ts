declare type EGender = import("../enums").EGender;

declare type Profile = BaseModel &
  TimeStampModel & {
    account: Account;
    firstName: string;
    lastName: string;
    birth: string;
    gender: EGender;
    phone: string;
    profilePicture: string;
    bio: string;
    isPublic: string;
  };

declare type UpdateProfileRequest = Partial<Profile>;

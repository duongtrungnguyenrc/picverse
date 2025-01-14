declare type Session = BaseModel &
  TimeStampModel & {
    accountId: string;
    activating: boolean;
  };

declare type AccessRecord = BaseModel &
  TimeStampModel & {
    accountId: string;
    sessionId: string;
    ipAddress: string;
    browserName: string;
    location: string;
  };

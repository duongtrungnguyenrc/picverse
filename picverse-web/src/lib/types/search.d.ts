declare type SearchPayload = {
  query: string;
  target?: import("../enums").ESearchTarget;
};

declare type SearchRecord = BaseModel &
  TimeStampModel & {
    query: string;
    accountId: string;
  };

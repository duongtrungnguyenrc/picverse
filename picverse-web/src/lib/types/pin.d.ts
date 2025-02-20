declare type Pin = BaseModel &
  TimeStampModel & {
    author?: Profile;
    authorId: string;
    boardId: DocumentId;
    title: string;
    description: string;
    resource: Resource | string;
    tags: Array<Tag>;
    isPublic: boolean;
    allowComment: boolean;
    allowShare: boolean;
    createdAt: Date;
  };

declare type PinDetail = Omit<Pin, "authorId" | "boardId"> & {
  author: Pick<Profile, "_id" | "accountId" | "firstName" | "lastName" | "avatar">;
  board?: Board;
  liked?: boolean;
};

declare type Cmt = BaseModel &
  Pick<TimeStampModel, "createdAt"> & {
    by: Pick<Profile, "_id" | "avatar" | "firstName" | "lastName">;
    replyFor?: Cmt;
    pinId: string;
    content: string;
  };

declare type Like = BaseModel &
  TimeStampModel & {
    accountId: string;
    pinId: string;
  };

declare type CreatePinRequest = {
  file: File;
  title: string;
  description: string;
  tags: Array<string>;
  boardId: string;
  isPublic: boolean;
  allowComment: boolean;
  allowShare: boolean;
};

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
    seoName?: string;
    createdAt: Date;
  };

declare type PinDetail = Omit<Pin, "boardId"> & {
  author: Pick<Profile, "_id" | "accountId" | "firstName" | "lastName" | "avatar">;
  board?: Board;
  resource: Resource;
  liked?: boolean;
};

declare type Cmt = BaseModel &
  Pick<TimeStampModel, "createdAt"> & {
    by: Pick<Profile, "_id" | "avatar" | "firstName" | "lastName">;
    replyFor?: string;
    pinId: string;
    content: string;
  };

declare type Like = BaseModel &
  TimeStampModel & {
    accountId: string;
    pinId: string;
  };

declare type ChoosenImage = {
  image: File;
  transformedImage?: File;
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

declare type CreatePinByResourceRequest = Omit<CreateCommentRequest, "file"> & {
  resourceId: string;
};

declare type CreateCommentRequest = {
  content: string;
  replyFor?: string;
};

declare type PinInteractionContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

declare type Pin = BaseModel &
  TimeStampModel & {
    author?: Profile;
    authorId: string;
    boardId: DocumentId;
    title: string;
    description: string;
    resource: string;
    tags: Array<Tag>;
    isPublic: boolean;
    allowComment: boolean;
    allowShare: boolean;
    createdAt: Date;
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

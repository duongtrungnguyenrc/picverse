declare type Pin = BaseModel &
  TimeStampedModel & {
    profileId: Profile;
    boardId: DocumentId;
    title: string;
    description: string;
    resources: Array<Resource>;
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

declare type Board = BaseModel &
  TimeStampModel & {
    profile: string;
    name: string;
    seoName: string;
    description: string;
    isPrivate: boolean;
    createdAt: string;
  };

declare type CreateBoardRequest = Pick<Board, "name" | "description" | "isPrivate">;

declare type UserBoard = Board & {
  totalPins: number;
  latestPins: Array<Pick<Pin, "_id" | "title" | "resource">>;
};

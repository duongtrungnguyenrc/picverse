declare type Board = BaseModel &
  TimeStampModel & {
    profile: string;
    name: string;
    description: string;
    isPrivate: boolean;
    createdAt: string;
  };

declare type CreateBoardRequest = Pick<Board, "name" | "description" | "isPrivate">;

declare type UserBoard = Board & {
  totalPins: number;
  lastestPins: Array<Pick<Pin, "_id" | "title" | "resource">>;
};

declare type Board = {
  profile: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
};

declare type CreateBoardRequest = Pick<Board, "name" | "description" | "isPrivate">;

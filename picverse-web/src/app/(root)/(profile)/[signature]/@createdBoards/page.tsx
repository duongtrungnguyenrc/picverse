import { BoardListing } from "@app/components";
import { loadUserBoards } from "@app/lib/actions";
import { FC } from "react";

type CreatedBoardsParallelPageProps = {};

const CreatedBoardsParallelPage: FC<CreatedBoardsParallelPageProps> = async ({}) => {
  const firstPageBoards = await loadUserBoards(undefined, { page: 1, limit: 20 });

  return <BoardListing firstPageBoards={firstPageBoards} />;
};

export default CreatedBoardsParallelPage;

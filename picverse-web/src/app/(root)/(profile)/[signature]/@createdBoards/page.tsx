import { BoardListing } from "@app/components";
import { loadUserBoards } from "@app/lib/actions";
import { FC } from "react";

type CreatedBoardsParallelPageProps = {};

const CreatedBoardsParallelPage: FC<CreatedBoardsParallelPageProps> = async ({}) => {
  const firstPageBoards = await loadUserBoards(undefined);

  return <BoardListing boards={firstPageBoards} />;
};

export default CreatedBoardsParallelPage;

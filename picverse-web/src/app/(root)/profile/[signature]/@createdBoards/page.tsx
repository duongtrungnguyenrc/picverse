import { FC } from "react";

import { loadUserBoards } from "@app/lib/actions";
import { BoardListing } from "@app/components";

type CreatedBoardsParallelPageProps = {
  params: Promise<{ signature: string }>;
};

const CreatedBoardsParallelPage: FC<CreatedBoardsParallelPageProps> = async ({ params }) => {
  const { signature } = await params;

  const firstPageBoards = await loadUserBoards(signature);

  return <BoardListing boards={firstPageBoards} />;
};

export default CreatedBoardsParallelPage;

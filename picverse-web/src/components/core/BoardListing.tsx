"use client";

import { FC, useMemo } from "react";

import Board from "./Board";
import { useUserBoards } from "@app/lib/hooks";
import Typography from "./Typography";

type BoardListingProps = {
  firstPageBoards: InfiniteResponse<UserBoard>;
  accountId?: string;
};

const BoardListing: FC<BoardListingProps> = ({ accountId, firstPageBoards }) => {
  const { data } = useUserBoards(accountId, firstPageBoards);

  const boards = useMemo(() => firstPageBoards.data || [], [data]);

  if (boards.length === 0) return <Typography>No board to present</Typography>;

  return (
    <ul className="w-full grid grid-cols-12 gap-4">
      {boards.map((board) => (
        <li className="col-span-6 md:col-span-4 lg:col-span-3" key={["board", "profile", board._id].join(":")}>
          <Board board={board} />
        </li>
      ))}
    </ul>
  );
};

export default BoardListing;

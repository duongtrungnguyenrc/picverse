"use client";

import { FC, useMemo } from "react";

import Board from "./Board";
import Typography from "./Typography";

type BoardListingProps = {
  boards: Array<UserBoard>;
};

const BoardListing: FC<BoardListingProps> = ({ boards }) => {
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

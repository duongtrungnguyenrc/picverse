import { FC } from "react";

import Board from "./Board";

type BoardListingProps = {};

const BoardListing: FC<BoardListingProps> = ({}) => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[0, 1, 2].map((collection, index) => (
        <li key={index}>
          <Board
            board={{
              profile: "string",
              name: "Hình nền điện thoại",
              description: "string",
              isPrivate: false,
              createdAt: "",
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default BoardListing;

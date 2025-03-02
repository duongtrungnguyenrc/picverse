"use client";
import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

import { getResourceUrl } from "@app/lib/utils";
import Typography from "./Typography";

type BoardProps = {
  board: UserBoard;
};

const Board: FC<BoardProps> = ({ board }) => {
  return (
    <div className="w-full">
      <ul className="relative flex w-full space-x-[-30px] h-[150px] lg:h-[180px] bg-muted rounded-lg">
        {board.latestPins?.map((pin) => {
          if (typeof pin.resource === "string") return null;

          return (
            <li
              key={["board", "pin", pin._id].join(":")}
              className="rounded-xl overflow-hidden border border-white w-[150px] h-full relative transform z-30"
            >
              <Image
                className="object-cover w-full h-full"
                src={getResourceUrl(pin.resource._id)}
                alt=""
                width={pin.resource.width}
                height={pin.resource.height}
              />
            </li>
          );
        })}

        {board.totalPins === 0 && (
          <div className="w-full h-full flex-col flex-center">
            <Plus />
            <Typography className="text-gray-500">empty board</Typography>
          </div>
        )}
      </ul>

      <h4 className="h4 mt-2">{board.name}</h4>
      <p>
        <b className="text-gray-600 font-semibold">{board.totalPins} Pins</b>
        <span className="text-xs ms-2">{board.createdAt ? formatDistanceToNow(board.createdAt) : ""}</span>
      </p>
    </div>
  );
};

export default Board;

"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { FC } from "react";

import { getResourceUrl } from "@app/lib/utils";
import Link from "next/link";
import PicverseImage from "./PicverseImage";

type BoardProps = {
  board: UserBoard;
};

const Board: FC<BoardProps> = ({ board }) => {
  return (
    <Link href={`/board/${board.seoName || board._id}`} className="w-full">
      <ul className="relative flex w-full space-x-[-30px] h-[150px] lg:h-[180px] bg-muted rounded-lg">
        {Array(3)
          .fill(null)
          ?.map((_, index) => {
            const pin = board.latestPins[index];

            if (!pin || typeof pin.resource === "string")
              return (
                <li
                  key={["board", "pin", index].join(":")}
                  className="rounded-xl overflow-hidden border border-white bg-muted shadow-sm w-[150px] h-full relative transform z-30"
                />
              );

            return (
              <li
                key={["board", "pin", pin._id, index].join(":")}
                className="rounded-xl overflow-hidden border border-white w-[150px] h-full relative transform z-30"
              >
                <PicverseImage
                  className="object-cover w-full h-full"
                  id={pin.resource._id}
                  alt=""
                  width={pin.resource.width}
                  height={pin.resource.height}
                />
              </li>
            );
          })}
      </ul>

      <h4 className="h4 mt-2">{board.name}</h4>
      <p>
        <b className="text-gray-600 font-semibold">{board.totalPins} Pins</b>
        <span className="text-xs ms-2">{board.createdAt ? formatDistanceToNow(board.createdAt) : ""}</span>
      </p>
    </Link>
  );
};

export default Board;

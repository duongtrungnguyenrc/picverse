"use client";

import Image from "next/image";
import { FC } from "react";

type BoardProps = {
  board: Board;
};

const Board: FC<BoardProps> = ({ board }) => {
  return (
    <div>
      <ul className="relative flex space-x-[-30px]">
        <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[150px] lg:h-[180px] relative transform z-30">
          <Image
            className="object-cover"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
            alt=""
            layout="fill"
          />
        </li>
        <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[150px] lg:h-[180px] relative transform z-20">
          <Image
            className="object-cover"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
            alt=""
            layout="fill"
          />
        </li>
        <li className="rounded-xl overflow-hidden border border-white w-[150px] h-[150px] lg:h-[180px] relative transform z-10">
          <Image
            className="object-cover"
            src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
            alt=""
            layout="fill"
          />
        </li>
      </ul>

      <h4 className="h4 mt-2">{board.name}</h4>
      <p>
        <b className="text-gray-600 font-semibold">7 ghim</b>
        <span className="text-xs ms-2">17 giờ</span>
      </p>
    </div>
  );
};

export default Board;

"use client";

import { FC, useMemo } from "react";

import MansoryPinGallery from "./MansoryPinGallery";
import { useFeeds } from "@app/lib/hooks";
import { Button } from "../shadcn";

type HomeGalleryProps = {
  firstPageData: InfiniteResponse<Pin>;
};

const HomeGallery: FC<HomeGalleryProps> = ({ firstPageData }) => {
  const { data: feeds, isFetching, fetchNextPage, hasNextPage } = useFeeds(firstPageData);

  const pins = useMemo(() => {
    const allPins = (feeds?.pages || []).flatMap((page) => page.data) as Array<Pin>;

    const uniquePins = Array.from(new Map(allPins.map((pin) => [pin._id, pin])).values());

    return uniquePins;
  }, [feeds]);

  return (
    <div id="gallery" className="lg:px-10 header-spacing">
      {/* <section className="flex flex-col px-1.5">
        <ul className="items-center flex max-w-full overflow-x-auto">
          <li>
            <Button variant="ghost">All</Button>
          </li>
          <li>
            <Button variant="ghost">Car</Button>
          </li>
          <li>
            <Button variant="ghost">Background</Button>
          </li>
          <li>
            <Button variant="ghost">Images</Button>
          </li>
        </ul>
      </section> */}

      <MansoryPinGallery pins={pins} loadMore={hasNextPage ? fetchNextPage : undefined} isFetching={isFetching} />
    </div>
  );
};

export default HomeGallery;

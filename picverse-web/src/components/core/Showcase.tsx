"use client";

import { FC, useMemo } from "react";
import MansoryPinListing from "./MansoryPinListing";
import { useFeeds } from "@app/lib/hooks";
import { Button } from "../shadcn";

const Showcase: FC = () => {
  const { data: feeds, isFetching, fetchNextPage, hasNextPage } = useFeeds();

  const pins = useMemo(
    () => (feeds?.pages || []).reduce((prev, page) => [...prev, ...page.data], [] as Array<Pin>),
    [feeds],
  );

  return (
    <section id="gallery" className="lg:px-10 header-spacing">
      <div className="flex flex-col px-1.5">
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
      </div>

      <MansoryPinListing pins={pins} loadMore={hasNextPage ? fetchNextPage : undefined} isFetching={isFetching} />
    </section>
  );
};

export default Showcase;

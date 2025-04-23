"use client";

import { FC, useMemo } from "react";

import MansoryPinGallery from "./MansoryPinGallery";
import { useSimilarPins } from "@app/lib/hooks";
import ContentSection from "./ContentSection";

type SimilarPinsSectionProps = {
  pinId: string;
};

const SimilarPinsSection: FC<SimilarPinsSectionProps> = ({ pinId }) => {
  const { data: feeds, isFetching, fetchNextPage, hasNextPage } = useSimilarPins(pinId);

  const pins = useMemo(() => (feeds?.pages || []).flatMap((page) => page.data) as Array<Pin>, [feeds]);

  return (
    <ContentSection heading="Similar pins" className="px-5 md:px-10 container">
      <MansoryPinGallery
        pins={pins}
        keyPrefix={`similar:${pinId}`}
        loadMore={hasNextPage ? fetchNextPage : undefined}
        isFetching={isFetching}
        layoutConfig={{
          xs: 2,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 6,
        }}
      />
    </ContentSection>
  );
};

export default SimilarPinsSection;

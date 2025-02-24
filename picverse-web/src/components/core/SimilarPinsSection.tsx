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
    <ContentSection heading="Similar pins" className="px-5 md:px-10">
      <MansoryPinGallery
        pins={pins}
        keyPrefix={`similar:${pinId}`}
        loadMore={hasNextPage ? fetchNextPage : undefined}
        isFetching={isFetching}
      />
    </ContentSection>
  );
};

export default SimilarPinsSection;

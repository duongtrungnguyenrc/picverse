import { FC } from "react";

import { loadFirstPageFeed } from "@app/lib/actions";
import { HomeGallery } from "@app/components";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = async ({}: HomePageProps) => {
  const firstPageFeed = await loadFirstPageFeed();

  return (
    <>
      <HomeGallery firstPageData={firstPageFeed} />
    </>
  );
};

export default HomePage;

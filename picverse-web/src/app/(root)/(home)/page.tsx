import { FC } from "react";

import { loadFeed } from "@app/lib/actions";
import { HomeGallery } from "@app/components";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = async ({}: HomePageProps) => {
  const firstPageFeed = await loadFeed({ page: 1, limit: 30 });

  return (
    <>
      <HomeGallery firstPageData={firstPageFeed} />
    </>
  );
};

export default HomePage;

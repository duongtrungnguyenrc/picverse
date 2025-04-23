import { Metadata } from "next";
import { FC } from "react";

import { loadFeed } from "@app/lib/actions";
import { HomeGallery } from "@app/components";

export const metadata: Metadata = {
  title: "Picverse",
  description: "Cloud social media platform",
  openGraph: {
    title: "Picverse",
    description: "Cloud social media platform",
    type: "website",
  },
};

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

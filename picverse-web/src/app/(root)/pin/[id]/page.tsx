import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FC } from "react";

import { PinDetail, SimilarPinsSection } from "@app/components";
import { getPinDetail } from "@app/lib/actions";
import { getResourceUrl } from "@app/lib/utils";

type PinPageProps = {
  params: Promise<{ signature: string }>;
};

// export const revalidate = 60;
// export const dynamicParams = true;

// export async function generateStaticParams() {
//   const staticFeed = await loadStaticFeed();

//   return staticFeed.data?.map((pin) => ({
//     id: String(pin._id),
//   }));
// }

export async function generateMetadata({ params }: PinPageProps): Promise<Metadata> {
  const { signature } = await params;

  if (!signature) notFound();

  const pin = await getPinDetail(signature);
  if (!pin) notFound();

  return {
    title: pin.title,
    description: pin.description,
    openGraph: {
      title: pin.title,
      description: pin.description,
      images: [getResourceUrl(pin.resource._id)],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pin.title,
      description: pin.description,
      images: [getResourceUrl(pin.resource._id)],
    },
  };
}

const PinPage: FC<PinPageProps> = async ({ params }) => {
  const { signature } = await params;

  if (!signature) notFound();

  const pin = await getPinDetail(signature);

  if (!pin) notFound();

  return (
    <div className="space-y-4 header-spacing">
      <PinDetail pin={pin} />
      <SimilarPinsSection pinId={pin._id} />
    </div>
  );
};

export default PinPage;

import { notFound } from "next/navigation";
import { FC } from "react";

import { PinDetail, SimilarPinsSection } from "@app/components";
import { getPinDetail, loadStaticFeed } from "@app/lib/actions";
import { Metadata } from "next";
import { getResourceUrl } from "@app/lib/utils";

type PinPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const staticFeed = await loadStaticFeed();

  return staticFeed.data?.map((pin) => ({
    id: String(pin._id),
  }));
}

export async function generateMetadata({ params }: PinPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) notFound();

  const pin = await getPinDetail(id);
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
  const { id } = await params;

  if (!id) notFound();

  const pin = await getPinDetail(id);

  if (!pin) notFound();

  return (
    <div className="space-y-4 header-spacing">
      <PinDetail pinId={id} prefetchedPin={pin} />
      <SimilarPinsSection pinId={id} />
    </div>
  );
};

export default PinPage;

import { notFound } from "next/navigation";
import { FC } from "react";

import { PinDetail, SimilarPinsSection } from "@app/components";
import { getPinDetail } from "@app/lib/actions";

type PinPageProps = {
  params: Promise<{ id: string }>;
};

const PinPage: FC<PinPageProps> = async ({ params }) => {
  const { id } = await params;

  if (!id) notFound();

  const pin = await getPinDetail(id);

  return (
    <div className="space-y-4 header-spacing">
      <PinDetail pinId={id} prefetchedPin={pin} />
      <SimilarPinsSection pinId={id} />
    </div>
  );
};

export default PinPage;

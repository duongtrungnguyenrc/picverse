import { notFound } from "next/navigation";
import { FC } from "react";

import { PinDetail } from "@app/components";

type PinPageProps = {
  params: Promise<{ id: string }>;
};

const PinPage: FC<PinPageProps> = async ({ params }) => {
  const { id } = await params;

  if (!id) notFound();

  return <PinDetail className="header-spacing" />;
};

export default PinPage;

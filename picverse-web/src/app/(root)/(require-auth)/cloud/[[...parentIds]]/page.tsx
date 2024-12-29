import { CloudControl, CloudPageContent } from "@app/components";
import { notFound } from "next/navigation";
import { FC } from "react";

type CloudPageProps = {
  params: Promise<{ parentIds: Array<string> }>;
};

const CloudPage: FC<CloudPageProps> = async ({ params }) => {
  const { parentIds } = await params;

  if (parentIds?.length > 1) notFound();

  const parentId = parentIds?.length > 0 ? parentIds[0] : undefined;

  return (
    <div className="header-spacing p-10">
      <CloudControl parentId={parentId} />

      <CloudPageContent parentId={parentId} />
    </div>
  );
};

export default CloudPage;

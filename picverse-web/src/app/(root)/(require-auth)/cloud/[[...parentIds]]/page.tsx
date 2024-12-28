import { CloudControl, CloudResourcesListing } from "@app/components";
import { notFound } from "next/navigation";
import { FC } from "react";

type CloudPageProps = {
  params: Promise<{ parentIds: Array<string> }>;
};

const CloudPage: FC<CloudPageProps> = async ({ params }) => {
  const { parentIds } = await params;

  if (parentIds?.length > 1) notFound();

  const parentId = parentIds?.length > 0 ? parentIds[0] : undefined

  return (
    <div className="header-spacing p-10">
      <CloudControl parentId={parentId}/>

      <CloudResourcesListing parentId={parentIds?.length > 0 ? parentIds[0] : undefined} />
    </div>
  );
};

export default CloudPage;

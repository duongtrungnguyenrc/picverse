import { CloudControl, CloudResourcesListing } from "@app/components";
import { FC } from "react";

type CloudPageProps = {};

const CloudPage: FC<CloudPageProps> = ({}) => {
  return (
    <div className="header-spacing p-10">
      <CloudControl />

      <CloudResourcesListing />
    </div>
  );
};

export default CloudPage;

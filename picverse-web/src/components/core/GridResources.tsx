import { FC } from "react";

import GridResourceItem from "./GridResourceItem";

const GridResources: FC<{
  resources: Resource[];
  onDrop: (dragId: string, dropId: string, action: "swap" | "move") => void;
}> = ({ resources, onDrop }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 transition-all gap-4">
      {resources.map((resource) => (
        <GridResourceItem key={`grid:${resource._id}`} resource={resource} onDrop={onDrop} />
      ))}
    </div>
  );
};

export default GridResources;

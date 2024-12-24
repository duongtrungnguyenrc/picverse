"use client";

import { Grid, List, PackageOpen } from "lucide-react";
import { FC, useState } from "react";

import { Button } from "../shadcn";
import { ContentSection } from ".";
import { cn } from "@app/lib/utils";

type CloudResourcesProps = {};

const listModes: Array<ListMode> = [
  {
    name: "grid",
    icon: <Grid />,
    style: "",
  },
  {
    name: "list",
    icon: <List />,
    style: "",
  },
];

const CloudResourcesListing: FC<CloudResourcesProps> = ({}) => {
  const [listModeIndex, setlistModeIndex] = useState<number>(0);

  return (
    <ContentSection
      subHeading="All resources"
      actions={
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {listModes.map((mode, index) => {
            return (
              <Button
                onClick={() => setlistModeIndex(index)}
                key={`resource-list-mode:${mode.name}`}
                size="sm"
                variant="ghost"
                className={cn(listModeIndex === index ? "bg-white" : "")}
              >
                {mode.icon}
              </Button>
            );
          })}
        </div>
      }
    >
      <div className="grid"></div>

      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <PackageOpen className=" text-muted-foreground" size={36} />
          <h3 className="mt-4 text-lg font-semibold">No resources added</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">You have not added any resources. Add one below.</p>
          <Button className="h-8 rounded-md px-3 text-xs relative" type="button">
            Add Resource
          </Button>
        </div>
      </div>
    </ContentSection>
  );
};

export default CloudResourcesListing;

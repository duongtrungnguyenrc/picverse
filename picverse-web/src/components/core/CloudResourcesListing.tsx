"use client";

import { Grid, List, Lock, PackageOpen } from "lucide-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { FC, useMemo, useCallback } from "react";

import {
  ContentSection,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectContent,
  Skeleton,
} from "@app/components";
import { useListing, useResources, useUpdateResource } from "@app/lib/hooks";
import { getAxiosErrorMessage } from "@app/lib/utils";
import { GridResources } from "./GridResources";
import { ListResources } from "./ListResources";
import { EResourceType } from "@app/lib/enums";

type CloudResourcesProps = {
  parentId?: string;
};

const listModes = [
  { name: "grid", icon: <Grid size={18} /> },
  { name: "list", icon: <List size={18} /> },
] as const;

const CloudResourcesListing: FC<CloudResourcesProps> = ({ parentId }) => {
  const { data, isPending, isFetched, error } = useResources(parentId);
  const { mutateAsync: updateResource, reset } = useUpdateResource();

  const resources = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);
  const { displayItems, onSearchChange, onFieldFilterChange, insertAfter } = useListing(resources);

  const handleDrop = useCallback(
    async (selfId: string, targetId: string, action?: string) => {
      if (action === "swap") {
        insertAfter(selfId, targetId, (item) => item._id);
      } else if (action === "move") {
        await updateResource({
          id: selfId,
          parentId: targetId,
        });
        reset();
      }
    },
    [insertAfter, updateResource, reset],
  );

  if (error) {
    return <ErrorState error={error} />;
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (resources.length === 0 && isFetched) {
    return <EmptyState />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs defaultValue="grid">
        <ContentSection
          subHeading="All resources"
          actions={<ResourceActions onSearchChange={onSearchChange} onFieldFilterChange={onFieldFilterChange} />}
        >
          <TabsContent value="grid">
            <GridResources resources={displayItems} onDrop={handleDrop} />
          </TabsContent>
          <TabsContent value="list">
            <ListResources resources={displayItems} onDrop={handleDrop} />
          </TabsContent>
        </ContentSection>
      </Tabs>
    </DndProvider>
  );
};

const ResourceActions: FC<{
  onSearchChange: (value: string) => void;
  onFieldFilterChange: (field: keyof Resource, value: string) => void;
}> = ({ onSearchChange, onFieldFilterChange }) => (
  <div className="flex items-center gap-3">
    <div className="grid grid-cols-2 gap-3">
      <Input placeholder="Search..." onChange={(e) => onSearchChange(e.target.value)} />
      <Select defaultValue="-" onValueChange={(type) => onFieldFilterChange("type", type)}>
        <SelectTrigger>
          <SelectValue placeholder="Resource type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="-">No type filter</SelectItem>
            {Object.values(EResourceType).map((type) => (
              <SelectItem key={`rs-filter:type:${type}`} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <TabsList>
      {listModes.map((mode) => (
        <TabsTrigger key={`tab:${mode.name}`} value={mode.name}>
          {mode.icon}
        </TabsTrigger>
      ))}
    </TabsList>
  </div>
);

const ErrorState: FC<{ error: AxiosError }> = ({ error }) => (
  <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed transition-all">
    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <Lock className="text-muted-foreground" size={36} />
      <h3 className="mt-4 text-lg font-semibold">Access error</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">{getAxiosErrorMessage(error)}</p>
    </div>
  </div>
);

const EmptyState: FC = () => (
  <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed transition-all">
    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <PackageOpen className="text-muted-foreground" size={36} />
      <h3 className="mt-4 text-lg font-semibold">No resources added</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">You have not added any resources. Add one below.</p>
      <Button className="h-8 rounded-md px-3 text-xs relative" type="button">
        Add Resource
      </Button>
    </div>
  </div>
);

const LoadingState: FC = () => (
  <div className="h-[450px] grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5">
    {Array.from({ length: 9 }).map((_, index) => (
      <Skeleton key={`skeleton-${index}`} className="w-full aspect-square" />
    ))}
  </div>
);

export default CloudResourcesListing;

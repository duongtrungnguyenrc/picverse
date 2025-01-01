"use client";

import { CloudUpload, PackageOpen, Lock, FolderPlus } from "lucide-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FC, useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";

import { useListing, useResources, useUpdateResource } from "@app/lib/hooks";
import { getAxiosErrorMessage } from "@app/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Tabs,
  TabsContent,
  Skeleton,
  ContentSection,
  Button,
  CloudUploadFileButton,
  GridResources,
  ListResources,
  CloudResourceActions,
  CloudCreateFolderButton,
} from "@app/components";

type CloudPageContentProps = {
  parentId?: string;
};

const CloudPageContent: FC<CloudPageContentProps> = ({ parentId }) => {
  const { data, isPending, isFetched, error, refetch } = useResources(parentId);
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

  const onContextMenuItemSelect = (event: Event) => event.preventDefault();

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
    <ContextMenu>
      <ContextMenuTrigger>
        <DndProvider backend={HTML5Backend}>
          <Tabs defaultValue="grid">
            <ContentSection
              heading="All resources"
              actions={
                <CloudResourceActions onSearchChange={onSearchChange} onFieldFilterChange={onFieldFilterChange} />
              }
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
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <CloudUploadFileButton>
          <ContextMenuItem onSelect={onContextMenuItemSelect}>
            Upload file
            <ContextMenuShortcut>
              <CloudUpload size={16} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </CloudUploadFileButton>
        <CloudCreateFolderButton>
          <ContextMenuItem onSelect={onContextMenuItemSelect}>
            Create folder
            <ContextMenuShortcut>
              <FolderPlus size={16} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </CloudCreateFolderButton>
        <ContextMenuItem onClick={() => refetch()}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

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

export default CloudPageContent;

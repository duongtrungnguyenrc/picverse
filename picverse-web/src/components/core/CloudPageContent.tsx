"use client";

import { CloudUpload, PackageOpen, FolderPlus } from "lucide-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FC, useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";

import { useListing, useUpdateResource } from "@app/lib/hooks";
import { revalidateCloudResources } from "@app/lib/actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Tabs,
  TabsContent,
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
  firstPageResources: GetResourcesResponse;
};

const CloudPageContent: FC<CloudPageContentProps> = ({ firstPageResources }) => {
  const { mutateAsync: updateResource, reset } = useUpdateResource();

  const resources = useMemo(() => firstPageResources?.data || [], [firstPageResources]);
  const { displayItems, onSearchChange, onFieldFilterChange, insertAfter } = useListing<Resource>(resources);

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

  if (resources.length === 0) {
    return <EmptyState />;
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
        <ContextMenuItem onClick={revalidateCloudResources}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

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

export default CloudPageContent;

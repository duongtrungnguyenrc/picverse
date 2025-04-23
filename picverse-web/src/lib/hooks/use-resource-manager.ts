"use client";

import { useState, useCallback } from "react";
import { EResourceType } from "@app/lib/enums";

export const useResourceManager = (initialResources: Resource[]) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);

  const moveResource = useCallback((dragId: string, dropId: string) => {
    setResources((prevResources) => {
      const dragIndex = prevResources.findIndex((res) => res._id === dragId);
      const dropIndex = prevResources.findIndex((res) => res._id === dropId);

      if (dragIndex === -1 || dropIndex === -1) return prevResources;

      const newResources = [...prevResources];
      const [draggedItem] = newResources.splice(dragIndex, 1);

      if (newResources[dropIndex].type === EResourceType.FOLDER) {
        draggedItem.parentId = dropId;
        newResources.splice(dropIndex, 0, draggedItem);
      } else {
        newResources.splice(dropIndex, 0, draggedItem);
      }

      return newResources;
    });
  }, []);

  return { resources, moveResource };
};

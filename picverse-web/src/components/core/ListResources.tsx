"use client";

import { useDrag, useDrop } from "react-dnd";
import Image from "next/image";
import { FC } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components";
import { EResourceType } from "@app/lib/enums";
import { cn } from "@app/lib/utils";

type ResourceProps = {
  resource: Resource;
  onDrop: (fileId: string, folderId: string) => void;
};

const ListResource: FC<ResourceProps> = ({ resource, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "RESOURCE",
    item: { id: resource._id, type: resource.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "RESOURCE",
    drop: (item: { id: string; type: EResourceType }) => {
      if (item.type === EResourceType.FILE && resource.type === EResourceType.FOLDER) {
        onDrop(item.id, resource._id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <TableRow
      ref={(el) => {
        drag(el);
        drop(el);
      }}
      className={cn("cursor-move transition-all", isDragging && "opacity-50", isOver && "ring-2 ring-primary")}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-[60px] h-[60px] overflow-hidden rounded relative bg-gray-100">
            <Image
              className="object-contain"
              src={
                resource.type === EResourceType.FILE
                  ? `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/cloud/file/${resource._id}`
                  : "/images/folder.png"
              }
              alt={resource.name}
              layout="fill"
            />
          </div>
          <p className="text-sm text-black font-medium truncate">{resource.name}</p>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium">
          <span className="capitalize">{resource.storage}</span> {resource.type}
        </p>
      </TableCell>
      <TableCell>{/* Add any actions here */}</TableCell>
    </TableRow>
  );
};

const ListResources: FC<{ resources: Resource[]; onDrop: (fileId: string, folderId: string) => void }> = ({
  resources,
  onDrop,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <ListResource key={`list:${resource._id}`} resource={resource} onDrop={onDrop} />
        ))}
      </TableBody>
    </Table>
  );
};

export default ListResources;

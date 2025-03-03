"use client";

import { Earth, Link2, Lock, Pen, Pin, Trash } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { FC, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn";
import { EResourceType } from "@app/lib/enums";
import { cn, getResourceUrl } from "@app/lib/utils";
import { useDeleteFile, useDeleteFolder, useUpdateResource } from "@app/lib/hooks";
import toast from "react-hot-toast";
import PicverseImage from "./PicverseImage";

type GridResourceItemProps = {
  resource: Resource;
  onDrop: (dragId: string, dropId: string, action: "swap" | "move") => void;
};

const GridResourceItem: FC<GridResourceItemProps> = ({ resource, onDrop }) => {
  const { mutate: deleteResource } = (resource.type === EResourceType.FILE ? useDeleteFile : useDeleteFolder)();
  const { mutate: updateResource } = useUpdateResource();
  const inputRef = useRef<HTMLInputElement>(null);

  const { _id, name, type, storage, isPrivate } = resource;
  const isFile = type === EResourceType.FILE;

  const [{ isDragging }, drag] = useDrag({
    type: "RESOURCE",
    item: { id: _id, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const useCreateDrop = (action: "swap" | "move") =>
    useDrop({
      accept: "RESOURCE",
      drop: (item: { id: string }) => item.id !== _id && onDrop(item.id, _id, action),
      canDrop: (item) => item.id !== _id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

  const [{ isOver: isMoveOver, canDrop: canMoveDrop }, move] = useCreateDrop("move");
  const [{ isOver: isSwapOver, canDrop: canSwapDrop }, swap] = useCreateDrop("swap");

  const renderClasses = cn(
    "w-full h-fit transition-all p-2 rounded",
    isDragging && "opacity-50 scale-75",
    isMoveOver && canMoveDrop && "ring-2 ring-primary bg-primary/10 scale-105",
    isSwapOver && canSwapDrop && "border-r-2 border-primary",
  );

  const renderImage = () =>
    type === EResourceType.FOLDER ? (
      <Image
        className="object-contain w-full h-full"
        src="/images/folder.png"
        alt={name}
        width={100}
        height={100}
        objectFit="contain"
      />
    ) : (
      <PicverseImage
        className="object-contain w-full h-full"
        id={_id}
        alt={name}
        width={resource.width || 100}
        height={resource.height || 100}
        objectFit="contain"
      />
    );

  const handleRename = (newName: string) => {
    if (newName !== name) {
      updateResource({ id: _id, name: newName });
    }
  };

  const handlePrivacyChange = () => {
    updateResource({ id: _id, isPrivate: !isPrivate });
  };

  const renderInput = () => {
    const handleDoubleClick = () => {
      requestAnimationFrame(() => inputRef.current?.focus());
    };

    const handleBlur = () => {
      if (inputRef.current) {
        handleRename(inputRef.current.value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputRef.current) {
        handleRename(inputRef.current.value);
      }
    };

    return (
      <div className="w-full flex items-center justify-between">
        <input
          ref={inputRef}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          defaultValue={name}
          className="text-sm text-black bg-transparent font-medium truncate focus:px-1 focus:py-0.5 max-w-[80%] flex-1 transition-all"
        />
        {isFile && (isPrivate ? <Lock size={12} /> : <Earth size={12} />)}
      </div>
    );
  };

  const handleCopyUrl = () => {
    "client only";

    const url: string = isFile
      ? `${window.location.origin}/public/image?id=${_id}`
      : `${window.location.origin}/cloud?parentId=${_id}`;

    navigator.clipboard.writeText(url).then(() => {
      toast.success("The resource URL has been copied to your clipboard.");
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={(element) => {
            drag(element);
          }}
          className={renderClasses}
        >
          {isFile ? (
            <Dialog>
              <DialogTrigger asChild>
                <div
                  ref={(element) => {
                    move(element);
                  }}
                  className="w-full cursor-pointer aspect-square overflow-hidden rounded relative bg-gray-100"
                >
                  {renderImage()}
                </div>
              </DialogTrigger>
              <DialogContent className="min-w-[80vw] h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{name}</DialogTitle>
                </DialogHeader>
                <Image layout="fill" src={getResourceUrl(_id)} alt="" className="object-contain pt-20" />
              </DialogContent>
            </Dialog>
          ) : (
            <Link href={`/cloud?parentId=${_id}`}>
              <div
                ref={(element) => {
                  move(element);
                }}
                className="w-full aspect-square overflow-hidden rounded relative bg-gray-100"
              >
                {renderImage()}
              </div>
            </Link>
          )}
          <div
            ref={(element) => {
              swap(element);
            }}
            className="flex flex-col mt-2"
          >
            {renderInput()}
            <p className="text-xs text-muted-foreground">
              <span className="capitalize">{storage}</span> {type}
            </p>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={handlePrivacyChange}>
          Make {isPrivate ? "public" : "private"}
          <ContextMenuShortcut>{isPrivate ? <Earth size={16} /> : <Lock size={16} />}</ContextMenuShortcut>
        </ContextMenuItem>
        <Link href={`/new-pin?resource=${resource._id}`}>
          <ContextMenuItem>
            Create pin
            <ContextMenuShortcut>
              <Pin size={16} />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </Link>
        <ContextMenuItem onSelect={handleCopyUrl}>
          Copy url
          <ContextMenuShortcut>
            <Link2 size={16} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={() => {
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          Rename
          <ContextMenuShortcut>
            <Pen size={16} />
          </ContextMenuShortcut>
        </ContextMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ContextMenuItem onSelect={(event) => event.preventDefault()}>
              Delete
              <ContextMenuShortcut>
                <Trash size={16} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {type} &quot;{name}&quot;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteResource(_id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
};

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

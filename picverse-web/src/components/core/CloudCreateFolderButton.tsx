"use client";

import { useForm } from "react-hook-form";
import { FC, ReactNode } from "react";
import toast from "react-hot-toast";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "../shadcn";
import { useCreateFolder } from "@app/lib/hooks";

type CloudCreateFolderButtonProps = {
  parentId?: string;
  children: ReactNode;
};

const CloudCreateFolderButton: FC<CloudCreateFolderButtonProps> = ({ parentId, children }) => {
  const { register, handleSubmit, reset } = useForm<CreateFolderRequest>();
  const { mutateAsync: createFolder, isPending } = useCreateFolder(parentId);

  const onSubmit = async (data: CreateFolderRequest) => {
    try {
      await createFolder(data);
      reset();
    } catch (error) {
      toast.error("Upload failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input placeholder="Folder name" className="col-span-3 text-sm placeholder:text-sm" {...register("name")} />
          <DialogFooter className="flex justify-end">
            <Button className="text-sm" type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Save folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CloudCreateFolderButton;

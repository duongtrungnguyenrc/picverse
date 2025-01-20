"use client";

import { PinturaEditor } from "@pqina/react-pintura";
import { getEditorDefaults } from "@pqina/pintura";
import { FC, ReactNode } from "react";
import "@pqina/pintura/pintura.css";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../shadcn";
import { cn } from "@app/lib/utils";

const pinturaConfig = getEditorDefaults({});

type ImageTransformDialogProps = {
  children: ReactNode;
  mediaUrl?: string;
};

const ImageTransformDialog: FC<ImageTransformDialogProps> = ({ children, mediaUrl }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="lg:min-w-[60vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Image adjust</DialogTitle>
        </DialogHeader>

        <div>
          <PinturaEditor
            {...pinturaConfig}
            src={mediaUrl}
            imageCropAspectRatio={1}
            className={cn("h-[600px] w-full")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageTransformDialog;

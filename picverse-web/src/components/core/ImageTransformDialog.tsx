"use client";

import { getEditorDefaults, PinturaDefaultImageWriterResult } from "@pqina/pintura";
import { PinturaEditor } from "@pqina/react-pintura";
import { FC, ReactNode, useCallback } from "react";
import "@pqina/pintura/pintura.css";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../shadcn";
import { cn } from "@app/lib/utils";

const pinturaConfig = getEditorDefaults({});

type ImageTransformDialogProps = {
  children: ReactNode;
  mediaUrl?: string;
  onTransformed?: (updatedImage: File) => void;
};

const ImageTransformDialog: FC<ImageTransformDialogProps> = ({ children, mediaUrl, onTransformed }) => {
  const onProcessImage = useCallback((detail: PinturaDefaultImageWriterResult) => {
    console.log(detail);
    onTransformed?.(detail.dest);
  }, []);

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
            onProcess={onProcessImage}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageTransformDialog;

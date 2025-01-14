"use client";

import { PinturaEditor } from "@pqina/react-pintura";
import { getEditorDefaults } from "@pqina/pintura";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@app/components";
import { FC, useState } from "react";
import "@pqina/pintura/pintura.css";

import { cn } from "@app/lib/utils";

interface ImageEditorProps {
  onImageUpload?: (url: string) => void;
}

const pinturaConfig = getEditorDefaults({});

const ImageEditor: FC<ImageEditorProps> = ({ onImageUpload = (url: string) => {} }) => {
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleUpload = (result: any) => {
    setShowEditor(true);
    setTempImageUrl(result.info.secure_url);

    console.log(result.info.secure_url);
  };

  const handleEditorConfirm = (result: any) => {
    onImageUpload(result.dest);
    setShowEditor(false);
  };

  return (
    <div className="space-y-4">
      <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={handleUpload}>
        {({ open }) => <Button onClick={() => open()}>Upload Image</Button>}
      </CldUploadWidget>

      {tempImageUrl && !showEditor && (
        <div className="space-x-2">
          <Button onClick={() => setShowEditor(true)}>Edit with Pintura</Button>
          <Button onClick={() => onImageUpload(tempImageUrl)}>Use Original Image</Button>
        </div>
      )}

      {/* <PinturaEditor
        {...pinturaConfig}
        src={tempImageUrl || ""}
        //   onConfirm={handleEditorConfirm}
        //   onCancel={() => setShowEditor(false)}

        imageCropAspectRatio={1}
        className={cn("h-[600px] w-full")}
      /> */}
    </div>
  );
};

export default ImageEditor;

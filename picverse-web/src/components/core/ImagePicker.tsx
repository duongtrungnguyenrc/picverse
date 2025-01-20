"use client";

import { CloudUpload, Loader2, SlidersHorizontal, Sparkles, Trash } from "lucide-react";
import { ChangeEvent, FC, useCallback, useEffect } from "react";
import Image from "next/image";

import { useDeleteCloudinaryImage, useUploadCloudinaryImage } from "@app/lib/hooks";
import { ImageAiTransformDialog, ImageTransformDialog } from ".";
import { cn, skeletonPlaceholder } from "@app/lib/utils";
import { Button } from "../shadcn";
import { CldImage } from "next-cloudinary";

type ImagePickerProps = {
  accept?: string;
  className?: string;
};

const ImagePicker: FC<ImagePickerProps> = ({ accept, className }) => {
  const { data: cldImage, mutate: uploadCloudinaryImage, reset, isPending: isUploading } = useUploadCloudinaryImage();
  const { mutateAsync: deleteCloudinaryImage } = useDeleteCloudinaryImage();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];

    if (file) {
      uploadCloudinaryImage(file);
    }
  };

  const deleteImage = async (publicId: string) => {
    await deleteCloudinaryImage(publicId);
    reset();
  };

  const onDelete = useCallback(() => {
    if (cldImage) deleteImage(cldImage.public_id);
  }, [cldImage, deleteImage]);

  const onImageTransform = useCallback((transformedUrl: string) => {}, []);

  useEffect(() => {
    return () => {
      if (cldImage) {
        deleteImage(cldImage.public_id);
      }
    };
  }, [cldImage]);

  return (
    <label
      htmlFor="media-picker"
      className={cn(
        "min-h-[300px] flex-1 flex-center flex-col rounded-lg border border-dashed cursor-pointer group relative",
        className,
        isUploading ? "bg-gray-50 pointer-events-none" : "",
      )}
    >
      <input onChange={onChange} id="media-picker" className="hidden" type="file" accept={accept || "image/*"} />

      {cldImage ? (
        <>
          <CldImage
            {...cldImage}
            placeholder={skeletonPlaceholder as any}
            src={cldImage.public_id}
            alt=""
            className="w-full h-full absolute top-0 left-0 object-contain"
          />

          <div className="flex-center items-end h-full pb-5 gap-x-2 opacity-0 group-hover:opacity-100 z-10 transition-all">
            <ImageTransformDialog mediaUrl={cldImage.secure_url}>
              <Button className="hover:bg-primary" size="sm" variant="secondary">
                <SlidersHorizontal />
              </Button>
            </ImageTransformDialog>

            <ImageAiTransformDialog onImageTransform={onImageTransform} cldImage={cldImage}>
              <Button className="hover:bg-primary" size="sm" variant="secondary">
                <Sparkles />
              </Button>
            </ImageAiTransformDialog>

            <Button onClick={onDelete} className="hover:bg-primary" size="sm" variant="secondary">
              <Trash />
            </Button>
          </div>
        </>
      ) : !isUploading ? (
        <>
          <CloudUpload className="text-gray-500" />
          <p className="text-xs">Upload file</p>
        </>
      ) : (
        <>
          <Loader2 size={16} className="animate-spin text-gray-500" />
          <p>Uploading image...</p>
        </>
      )}
    </label>
  );
};

export default ImagePicker;

"use client";

import { CloudUpload, Loader2, SlidersHorizontal, Sparkles, Trash, Undo } from "lucide-react";
import { ChangeEvent, FC, memo, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

import { useDeleteCloudinaryImage, useUploadCloudinaryImage } from "@app/lib/hooks";
import { ImageAiTransformDialog, ImageTransformDialog } from ".";
import { cn } from "@app/lib/utils";
import { Button } from "../shadcn";

type ImagePickerProps = {
  accept?: string;
  className?: string;
};

const ImagePicker: FC<ImagePickerProps> = ({ accept, className }) => {
  const { data: cldImage, mutate: uploadCloudinaryImage, reset, isPending: isUploading } = useUploadCloudinaryImage();
  const [choosenImage, setChoosenImage] = useState<
    | {
        image: File;
        transformedImage?: File;
      }
    | undefined
  >();

  const { mutateAsync: deleteCloudinaryImage } = useDeleteCloudinaryImage();
  const previewUrl: string | undefined = choosenImage
    ? URL.createObjectURL(choosenImage.transformedImage || choosenImage.image)
    : undefined;

  const onDelete = useCallback(
    async (id?: string) => {
      const publicId = id || cldImage?.public_id;

      if (publicId) {
        await deleteCloudinaryImage(publicId);
        reset();
      }
    },
    [cldImage],
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];

    if (file) {
      uploadCloudinaryImage(file, {
        onSuccess: () => {
          setChoosenImage({
            image: file,
          });

          toast.success("File uploaded success");
        },
        onError: (error) => {
          toast.error("File upload failed: " + error);
        },
      });
    }
  };

  const onUndoTransform = () => {
    setChoosenImage((prevState) =>
      prevState
        ? {
            image: prevState.image,
          }
        : undefined,
    );
  };

  const onTransformedImage = useCallback((transformedImage: File) => {
    setChoosenImage((prevState) => (prevState ? { ...prevState, transformedImage } : undefined));
  }, []);

  useEffect(() => {
    return () => {
      if (cldImage) {
        onDelete();
      }
    };
  }, [cldImage]);

  return (
    <label
      htmlFor="media-picker"
      className={cn(
        "min-h-[300px] flex-1 flex-center flex-col rounded-lg border border-dashed cursor-pointer group relative overflow-hidden",
        className,
        isUploading ? "bg-gray-50 pointer-events-none" : "",
      )}
    >
      <input onChange={onChange} id="media-picker" className="hidden" type="file" accept={accept || "image/*"} />

      {cldImage ? (
        <>
          {previewUrl && (
            <Image src={previewUrl} alt="Preview image" layout="fill" className="w-full h-full object-contain" />
          )}

          <div className="flex-center items-end h-full pb-5 gap-x-2 opacity-0 group-hover:opacity-100 z-10 transition-all">
            {choosenImage?.transformedImage && (
              <Button onClick={() => onUndoTransform()} size="sm" variant="outline">
                <Undo />
              </Button>
            )}

            <ImageTransformDialog onTransformed={onTransformedImage} mediaUrl={previewUrl}>
              <Button size="sm" variant="outline">
                <SlidersHorizontal />
              </Button>
            </ImageTransformDialog>

            <ImageAiTransformDialog cldImage={cldImage}>
              <Button size="sm" variant="outline">
                <Sparkles />
              </Button>
            </ImageAiTransformDialog>

            <Button onClick={() => onDelete()} size="sm" variant="outline">
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
          <Loader2 size={16} className="animate-spin text-gray-500 mb-1" />
          <p>Uploading image...</p>
        </>
      )}
    </label>
  );
};

export default memo(ImagePicker);

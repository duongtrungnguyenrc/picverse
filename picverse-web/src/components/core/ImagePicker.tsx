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
  onChange?: (file: File) => void;
  chosenImage?: Partial<ChoosenImage>;
  setChosenImage?: (image: Partial<ChoosenImage>) => void;
};

const ImagePicker: FC<ImagePickerProps> = ({ accept, className, onChange, chosenImage, setChosenImage }) => {
  const { data: cldImage, mutate: uploadCloudinaryImage, reset, isPending: isUploading } = useUploadCloudinaryImage();
  const [localChosenImage, setLocalChosenImage] = useState<Partial<ChoosenImage>>(chosenImage ?? {});

  const { mutateAsync: deleteCloudinaryImage } = useDeleteCloudinaryImage();

  const previewUrl = localChosenImage.image
    ? URL.createObjectURL(localChosenImage.transformedImage || localChosenImage.image)
    : undefined;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onDelete = useCallback(
    async (id?: string) => {
      const publicId = id || cldImage?.public_id;

      if (publicId) {
        await deleteCloudinaryImage(publicId);
        reset();
        setLocalChosenImage({});
        setChosenImage?.({});
      }
    },
    [cldImage, deleteCloudinaryImage, reset, setChosenImage],
  );

  const onSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadCloudinaryImage(file, {
      onSuccess: () => {
        const newImage = { image: file };
        setLocalChosenImage(newImage);
        setChosenImage?.(newImage);
        toast.success("File uploaded successfully");
      },
      onError: (error) => {
        toast.error("File upload failed: " + error);
      },
    });
  };

  const onUndoTransform = () => {
    setLocalChosenImage((prevState) => {
      const updatedImage = prevState?.image ? { image: prevState.image } : {};
      setChosenImage?.(updatedImage);
      return updatedImage;
    });
  };

  const onTransformedImage = useCallback(
    (transformedImage: File) => {
      setLocalChosenImage((prevState) => {
        const updatedImage = prevState ? { ...prevState, transformedImage } : {};
        setChosenImage?.(updatedImage);
        return updatedImage;
      });
    },
    [setChosenImage],
  );

  useEffect(() => {
    return () => {
      onDelete();
    };
  }, [cldImage]);

  useEffect(() => {
    const file = localChosenImage.transformedImage || localChosenImage.image;

    if (file instanceof File) {
      onChange?.(file);
    }
  }, [localChosenImage, onChange]);

  useEffect(() => {
    setLocalChosenImage(chosenImage ?? {});
  }, [chosenImage]);

  return (
    <label
      htmlFor="media-picker"
      className={cn(
        "min-h-[300px] flex-1 flex-center flex-col rounded-lg border border-dashed cursor-pointer group relative overflow-hidden",
        className,
        isUploading ? "bg-gray-50 pointer-events-none" : "",
      )}
    >
      <input onChange={onSelectImage} id="media-picker" className="hidden" type="file" accept={accept || "image/*"} />

      {previewUrl && (
        <>
          <Image src={previewUrl} alt="Preview image" layout="fill" className="w-full h-full object-contain" />

          <div className="flex-center items-end h-full pb-5 gap-x-2 opacity-0 group-hover:opacity-100 z-10 transition-all">
            {localChosenImage?.transformedImage && (
              <Button onClick={onUndoTransform} size="sm" variant="outline">
                <Undo />
              </Button>
            )}

            <ImageTransformDialog onTransformed={onTransformedImage} mediaUrl={previewUrl}>
              <Button type="button" size="sm" variant="outline">
                <SlidersHorizontal />
              </Button>
            </ImageTransformDialog>

            {cldImage && (
              <ImageAiTransformDialog onTransformed={onTransformedImage} cldImage={cldImage}>
                <Button type="button" size="sm" variant="outline">
                  <Sparkles />
                </Button>
              </ImageAiTransformDialog>
            )}

            <Button type="button" onClick={() => onDelete()} size="sm" variant="outline">
              <Trash />
            </Button>
          </div>
        </>
      )}

      {!previewUrl && !isUploading && (
        <>
          <CloudUpload className="text-gray-500" />
          <p className="text-xs">Upload file</p>
        </>
      )}

      {isUploading && (
        <>
          <Loader2 size={16} className="animate-spin text-gray-500 mb-1" />
          <p>Uploading image...</p>
        </>
      )}
    </label>
  );
};

export default memo(ImagePicker);

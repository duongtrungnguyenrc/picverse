"use client";

import { FC, ReactNode, useState } from "react";
import { CloudUpload } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn";
import { useExternalStorageLinkStatus, useUploadFile } from "@app/lib/hooks";
import { ECloudStorage } from "@app/lib/enums";

type CloudUploadFileButtonProps = {
  parentId?: string;
  children: ReactNode;
};

const CloudUploadFileButton: FC<CloudUploadFileButtonProps> = ({ parentId, children }) => {
  const [file, setFile] = useState<{ file?: File; previewUrl?: string }>({});
  const { mutateAsync: uploadFile, isPending } = useUploadFile(parentId);
  const { data: linkStatus } = useExternalStorageLinkStatus();
  const form = useForm<UploadFileRequest>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile({ file: selectedFile, previewUrl: URL.createObjectURL(selectedFile) });
    }
  };

  const onSubmit = async (data: UploadFileRequest) => {
    if (!file.file) return;

    try {
      await uploadFile({
        ...data,
        file: file.file,
      });
      form.reset();
      setFile({ file: undefined, previewUrl: undefined });
    } catch (error) {
      toast.error("Upload failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <Label
              htmlFor="uploadFileInput"
              className="h-[200px] flex flex-col items-center justify-center rounded-lg border border-dashed cursor-pointer"
            >
              <input
                id="uploadFileInput"
                type="file"
                accept=".png,.jpg,.JPG,.JPEG,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {file.previewUrl ? (
                <img src={file.previewUrl} alt="Preview" className="max-h-[180px] object-contain" />
              ) : (
                <>
                  <CloudUpload className="text-gray-500" />
                  <p className="text-xs">Upload file</p>
                </>
              )}
            </Label>
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File name (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="New file name (optional)"
                      className="col-span-3 text-sm placeholder:text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select storage (default is local)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(linkStatus || {}).map(([storage, isLinked]) => {
                            if (storage != ECloudStorage.LOCAL && !isLinked) return null;

                            return (
                              <SelectItem key={`up:storages:${storage}`} value={storage}>
                                {storage}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <Button className="text-sm" type="submit" disabled={isPending}>
                {isPending ? "Uploading..." : "Save file"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CloudUploadFileButton;

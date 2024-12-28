"use client";

import { FolderPlus, Cloudy, Settings, Share, Upload, ChartBarBig, CloudUpload, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FC, ReactElement, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "../shadcn";
import { useCreateFolder, useExternalStorageLinkStatus, useLinkExternalStorage, useUploadFile } from "@app/lib/hooks";
import ContentSection from "./ContentSection";
import toast from "react-hot-toast";
import { ECloudStorage } from "@app/lib/enums";
import { cn } from "@app/lib/utils";

type UploadFileProps = {
  parentId?: string;
};

const UploadFile: FC<UploadFileProps> = ({ parentId }) => {
  const { register, handleSubmit, reset } = useForm<UploadFileRequest>();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: uploadFile, isPending } = useUploadFile(parentId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data: UploadFileRequest) => {
    if (!file) return;

    try {
      await uploadFile({
        ...data,
        file,
      });
      reset();
      setPreview(null);
      setFile(null);
    } catch (error) {
      toast.error("Upload failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
          <CloudUpload size={16} />
          <span>Upload file</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Label
            htmlFor="uploadFileInput"
            className="h-[200px] flex flex-col items-center justify-center rounded-lg border border-dashed cursor-pointer"
          >
            <Input
              id="uploadFileInput"
              type="file"
              accept=".png,.jpg,.JPG,.JPEG,.webp"
              className="hidden"
              {...register("file")}
              onChange={handleFileChange}
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-[180px] object-contain" />
            ) : (
              <>
                <CloudUpload className="text-gray-500" />
                <p className="text-xs">Upload file</p>
              </>
            )}
          </Label>
          <Input
            placeholder="New file name (optional)"
            className="col-span-3 text-sm placeholder:text-sm"
            {...register("fileName")}
          />
          <DialogFooter className="flex justify-end">
            <Button className="text-sm" type="submit" disabled={isPending}>
              {isPending ? "Uploading..." : "Save file"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type CreateFolderProps = {
  parentId?: string;
};

const CreateFolder: FC<CreateFolderProps> = ({ parentId }) => {
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
      <DialogTrigger asChild>
        <div className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
          <FolderPlus size={16} />
          <span>Create folder</span>
        </div>
      </DialogTrigger>
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

type LinkExternalStorageProps = {};

const LinkExternalStorage: FC<LinkExternalStorageProps> = () => {
  const { data: storageStatus } = useExternalStorageLinkStatus();
  const { mutate: linkExternalStorage } = useLinkExternalStorage();

  const storages: Record<ECloudStorage, ReactElement> = {
    [ECloudStorage.DRIVE]: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
        <path
          fill="#1e88e5"
          d="M38.59,39c-0.535,0.93-0.298,1.68-1.195,2.197C36.498,41.715,35.465,42,34.39,42H13.61 c-1.074,0-2.106-0.285-3.004-0.802C9.708,40.681,9.945,39.93,9.41,39l7.67-9h13.84L38.59,39z"
        />
        <path
          fill="#fbc02d"
          d="M27.463,6.999c1.073-0.002,2.104-0.716,3.001-0.198c0.897,0.519,1.66,1.27,2.197,2.201l10.39,17.996 c0.537,0.93,0.807,1.967,0.808,3.002c0.001,1.037-1.267,2.073-1.806,3.001l-11.127-3.005l-6.924-11.993L27.463,6.999z"
        />
        <path
          fill="#e53935"
          d="M43.86,30c0,1.04-0.27,2.07-0.81,3l-3.67,6.35c-0.53,0.78-1.21,1.4-1.99,1.85L30.92,30H43.86z"
        />
        <path
          fill="#4caf50"
          d="M5.947,33.001c-0.538-0.928-1.806-1.964-1.806-3c0.001-1.036,0.27-2.073,0.808-3.004l10.39-17.996 c0.537-0.93,1.3-1.682,2.196-2.2c0.897-0.519,1.929,0.195,3.002,0.197l3.459,11.009l-6.922,11.989L5.947,33.001z"
        />
        <path
          fill="#1565c0"
          d="M17.08,30l-6.47,11.2c-0.78-0.45-1.46-1.07-1.99-1.85L4.95,33c-0.54-0.93-0.81-1.96-0.81-3H17.08z"
        />
        <path
          fill="#2e7d32"
          d="M30.46,6.8L24,18L17.53,6.8c0.78-0.45,1.66-0.73,2.6-0.79L27.46,6C28.54,6,29.57,6.28,30.46,6.8z"
        />
      </svg>
    ),
    [ECloudStorage.DROPBOX]: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
        <path
          fill="#1E88E5"
          d="M42 13.976L31.377 7.255 24 13.314 35.026 19.732zM6 25.647L16.933 32.055 24 26.633 13.528 19.969zM16.933 7.255L6 14.301 13.528 19.969 24 13.314zM24 26.633L31.209 32.055 42 25.647 35.026 19.732z"
        />
        <path
          fill="#1E88E5"
          d="M32.195 33.779L31.047 34.462 29.979 33.658 24 29.162 18.155 33.646 17.091 34.464 15.933 33.785 13 32.066 13 34.738 23.988 42 35 34.794 35 32.114z"
        />
      </svg>
    ),
    [ECloudStorage.LOCAL]: (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="48.000000pt"
        height="48.000000pt"
        viewBox="0 0 48.000000 48.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
          <path
            d="M106 348 c-8 -13 -17 -43 -21 -68 -3 -25 -9 -53 -11 -62 -5 -17 8
    -18 166 -18 153 0 171 2 166 16 -3 9 -6 27 -6 40 0 23 -2 24 -83 24 -71 0 -87
    3 -102 20 -11 12 -16 29 -13 45 5 24 3 25 -38 25 -34 0 -47 -5 -58 -22z"
          />
          <path
            d="M100 135 c0 -12 18 -15 100 -15 82 0 100 3 100 15 0 12 -18 15 -100
    15 -82 0 -100 -3 -100 -15z"
          />
          <path
            d="M355 130 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7
    -4 -4 -10z"
          />
        </g>
      </svg>
    ),
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
          <Cloudy size={16} />
          <span>Link storage</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link external cloud storage</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mt-5 gap-10">
          {storageStatus &&
            Object.entries(storageStatus).map(([key, isLinked]) => {
              const storageKey = key as ECloudStorage;

              return (
                <div
                  onClick={() => linkExternalStorage(storageKey)}
                  className={cn(
                    "cursor-pointer",
                    isLinked || storageKey === ECloudStorage.LOCAL
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "",
                  )}
                  key={`link-ext-storage:status:${key}`}
                >
                  <div className="w-[60px] h-[60px] flex justify-center items-center">{storages[storageKey]}</div>
                  <p className="text-center">{key}</p>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type CloudControlProps = {
  parentId?: string;
};

const CloudControl: FC<CloudControlProps> = ({ parentId }) => {
  return (
    <ContentSection subHeading="Cloud control" className="sticky top-0 h-fit">
      <ul className="flex flex-wrap gap-3 max-w-full">
        <li>
          <UploadFile parentId={parentId} />
        </li>

        <li>
          <CreateFolder parentId={parentId} />
        </li>

        <li>
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <Share size={16} />
            <span>Share</span>
          </Link>
        </li>

        <li>
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <ChartBarBig size={16} />
            <span>Statistic</span>
          </Link>
        </li>

        <li>
          <LinkExternalStorage />
        </li>

        <li>
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </ContentSection>
  );
};

export default CloudControl;

"use client";

import { FC, ReactElement, ReactNode } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../shadcn";
import { useExternalStorageLinkStatus, useLinkExternalStorage } from "@app/lib/hooks";
import { ECloudStorage } from "@app/lib/enums";
import { cn } from "@app/lib/utils";

type CloidLinkExternalStorageButtonProps = {
  children: ReactNode;
};

const CloudLinkExternalStorageButton: FC<CloidLinkExternalStorageButtonProps> = ({ children }) => {
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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

export default CloudLinkExternalStorageButton;

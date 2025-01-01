"use client";

import { FolderPlus, Cloudy, Settings, Share, ChartBarBig, CloudUpload } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import CloudLinkExternalStorageButton from "./CloudLinkExternalStorageButton";
import CloudCreateFolderButton from "./CloudCreateFolderButton";
import CloudUploadFileButton from "./CloudUploadFileButton";
import ContentSection from "./ContentSection";

type CloudControlProps = {
  parentId?: string;
};

const CloudControl: FC<CloudControlProps> = ({ parentId }) => {
  return (
    <ContentSection heading="Cloud control" className="sticky top-0 h-fit">
      <ul className="flex flex-wrap gap-3 max-w-full">
        <li>
          <CloudUploadFileButton parentId={parentId}>
            <div className="cursor-pointer p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
              <CloudUpload size={16} />
              <span>Upload file</span>
            </div>
          </CloudUploadFileButton>
        </li>

        <li>
          <CloudCreateFolderButton parentId={parentId}>
            <div className="cursor-pointer p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
              <FolderPlus size={16} />
              <span>Create folder</span>
            </div>
          </CloudCreateFolderButton>
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
          <CloudLinkExternalStorageButton>
            <div className="cursor-pointer p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
              <Cloudy size={16} />
              <span>Link storage</span>
            </div>
          </CloudLinkExternalStorageButton>
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

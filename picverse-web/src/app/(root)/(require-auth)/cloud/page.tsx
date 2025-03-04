import { ChartBarBig, CloudUpload, Cloudy, FolderPlus, Share } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";

import {
  CloudCreateFolderButton,
  CloudLinkExternalStorageButton,
  CloudPageContent,
  CloudStorageStatisticDialog,
  CloudUploadFileButton,
  ContentSection,
} from "@app/components";
import { loadResources } from "@app/lib/actions";

type CloudPageProps = {
  searchParams: Promise<{ parentId?: string }>;
};

export const metadata: Metadata = {
  title: "Cloud",
};

const CloudPage: FC<CloudPageProps> = async ({ searchParams }) => {
  const { parentId } = await searchParams;

  const firstPageResources = await loadResources(parentId, { page: 1, limit: 20 });

  return (
    <div className="header-spacing p-5 md:p-10">
      <ContentSection heading="Cloud control" className="h-fit">
        <ul className="grid grid-cols-2 md:gid-cols-3 lg:grid-cols-8 gap-3 max-w-full">
          <li>
            <CloudUploadFileButton parentId={parentId}>
              <div className="cursor-pointer p-3 w-full flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
                <CloudUpload size={16} />
                <span>Upload file</span>
              </div>
            </CloudUploadFileButton>
          </li>

          <li>
            <CloudCreateFolderButton parentId={parentId}>
              <div className="cursor-pointer p-3 w-full flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
                <FolderPlus size={16} />
                <span>Create folder</span>
              </div>
            </CloudCreateFolderButton>
          </li>

          <li>
            <Link
              className="p-3 w-full flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
              href=""
            >
              <Share size={16} />
              <span>Share</span>
            </Link>
          </li>

          <li>
            <CloudStorageStatisticDialog>
              <div className="p-3 w-full flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
                <ChartBarBig size={16} />
                <span>Statistic</span>
              </div>
            </CloudStorageStatisticDialog>
          </li>

          <li>
            <CloudLinkExternalStorageButton>
              <div className="cursor-pointer p-3 w-full flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all">
                <Cloudy size={16} />
                <span>Link storage</span>
              </div>
            </CloudLinkExternalStorageButton>
          </li>
        </ul>
      </ContentSection>

      <CloudPageContent parentId={parentId} firstPageResources={firstPageResources} />
    </div>
  );
};

export default CloudPage;

import { FolderPlus, Cloudy, Settings, Share, Upload, ChartBarBig } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import ContentSection from "./ContentSection";

type CloudSideBarProps = {};

const CloudControl: FC<CloudSideBarProps> = ({}) => {
  return (
    <ContentSection subHeading="Cloud control" className="sticky top-0 h-fit">
      <ul className="flex gap-3">
        <li>
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <Upload size={16} />
            <span>Upload file</span>
          </Link>
        </li>

        <li>
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <FolderPlus size={16} />
            <span>Create folder</span>
          </Link>
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
          <Link
            className="p-3 w-[150px] flex flex-col text-sm font-semibold gap-1 rounded-xl hover:bg-primary hover:text-white hover:border-primary border transition-all"
            href=""
          >
            <Cloudy size={16} />
            <span>Link storage</span>
          </Link>
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

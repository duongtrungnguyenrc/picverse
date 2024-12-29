import { SettingSideBar } from "@app/components";
import { FC, ReactNode } from "react";

type SettingsLayoutProps = {
  children: ReactNode;
};

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="header-spacing container grid grid-cols-12 space-x-10">
      <aside className="col-span-2 mt-10 sticky top-0 h-fit">
        <SettingSideBar />
      </aside>
      <div className="col-span-10 mt-10">{children}</div>
    </div>
  );
};

export default SettingsLayout;

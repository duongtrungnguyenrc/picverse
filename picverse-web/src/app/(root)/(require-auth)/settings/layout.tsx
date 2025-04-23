import { SettingHeader, SettingSideBar } from "@app/components";
import { FC, ReactNode } from "react";

type SettingsLayoutProps = {
  children: ReactNode;
};

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="header-spacing container grid grid-cols-12 relative">
      <aside className="hidden lg:block lg:col-span-2 mt-10 sticky top-[130px] h-fit">
        <SettingSideBar />
      </aside>
      <div className="col-span-full lg:col-span-10 mt-10 lg:ms-10 mb-10">
        <SettingHeader />

        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;

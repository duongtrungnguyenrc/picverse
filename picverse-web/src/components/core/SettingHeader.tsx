"use client";

import { settingRoutes } from "@app/lib/constants";
import { usePathname } from "next/navigation";
import { FC } from "react";

type SettingHeaderProps = {};

const SettingHeader: FC<SettingHeaderProps> = ({}) => {
  const pathname = usePathname();

  const activeRoute: Route | undefined = settingRoutes.find((route) => route.path === pathname);

  return (
    <section className="mb-10">
      <h1 className="h2 mb-1">{activeRoute?.name}</h1>

      <p>{activeRoute?.description}</p>
    </section>
  );
};

export default SettingHeader;

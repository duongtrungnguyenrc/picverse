"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";

import { settingRoutes } from "@app/lib/constants";
import { cn } from "@app/lib/utils";

type SettingSideBarProps = {};

const SettingSideBar: FC<SettingSideBarProps> = ({}) => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-2 rounded-xl">
        {settingRoutes.map((route) => {
          const isActive = pathname === route.path;

          return (
            <li className="flex w-full" key={`setting:route:${route.path}`}>
              <Link
                href={route.path}
                className={cn(
                  "font-semibold p-2 rounded-lg border bg-white text-sm w-full flex items-center gap-2 hover:bg-secondary transition-all",
                  isActive ? "bg-primary border-primary text-white hover:bg-primary" : "",
                )}
              >
                <div className="w-[30px] h-[30px] rounded-lg bg-secondary flex justify-center items-center text-black">
                  {route.icon}
                </div>
                {route.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SettingSideBar;

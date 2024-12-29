"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";
import { Bell, Fingerprint, Shield, User } from "lucide-react";
import { cn } from "@app/lib/utils";

type SettingSideBarProps = {};

const routes: Array<Route> = [
  {
    name: "Manage account",
    path: "/settings",
    icon: <Fingerprint size={16} />,
  },
  {
    name: "Manage profile",
    path: "/settings/profile",
    icon: <User size={16} />,
  },
  {
    name: "Account security",
    path: "/settings/security",
    icon: <Shield size={16} />,
  },
  {
    name: "Notifications",
    path: "/settings/notifications",
    icon: <Bell size={16} />,
  },
];

const SettingSideBar: FC<SettingSideBarProps> = ({}) => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-2 bg-gray-100 p-3 rounded-xl">
        {routes.map((route) => {
          const isActive = pathname === route.path;

          return (
            <li className="flex w-full" key={`setting:route:${route.path}`}>
              <Link
                href={route.path}
                className={cn(
                  "font-semibold p-2 rounded-lg bg-white text-sm w-full flex items-center gap-2",
                  isActive ? "bg-primary text-white" : "",
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

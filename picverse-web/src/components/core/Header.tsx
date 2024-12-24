"use client";

import { ArrowRight, Cloud, LogOut, Menu, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "../shadcn";
import { useSignOut } from "@app/lib/hooks";
import SearchInput from "./SearchInput";
import { SignedIn, SignedOut } from ".";
import { cn } from "@app/lib/utils";

type HeaderProps = {};

const Header: FC<HeaderProps> = ({}) => {
  const { mutate: signOut } = useSignOut();
  const pathname = usePathname();

  return (
    <header className="py-5 fixed top-0 left-0 w-screen z-50">
      <div
        className={cn(
          "container transition-all duration-500",
          pathname.includes("cloud") ? "sm:max-w-full" : "container",
        )}
      >
        <nav className={cn("flex items-center gap-3 bg-white border filter-[blur(3px)] mx-auto p-3 rounded-2xl")}>
          <div className="flex-1">
            <Link className="cursor-pointer" href="/">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            </Link>
          </div>
          <div className="flex items-center">
            <SearchInput />
            <SignedOut>
              <Link className="ms-3" href="/sign-in">
                <Button variant="outline" className="text-sm rounded-lg">
                  Sign in
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-sm rounded-lg ms-3">
                    <Menu />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-fit flex flex-col gap-2 rounded-lg p-3">
                  <ul>
                    <li>
                      <Link
                        className="w-full flex gap-2 items-center text-gray-500 hover:text-black py-1 transition-all text-sm"
                        href={`/me`}
                      >
                        <User size={16} /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="w-full flex gap-2 items-center text-gray-500 hover:text-black py-1 transition-all text-sm"
                        href={`/cloud`}
                      >
                        <Cloud size={16} /> Cloud
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="w-full flex gap-2 items-center text-gray-500 hover:text-black py-1 transition-all text-sm"
                        href={`/settings`}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut()}
                        className="flex gap-2 items-center text-gray-500 hover:text-black py-1 transition-all text-sm"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </SignedIn>
            <Button className="text-sm rounded-lg ms-3">
              Explore <ArrowRight size={16} />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

"use client";

import { ArrowRight, Cloud, LogIn, LogOut, Menu, Pin, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "../shadcn";
import { Logo, SignedIn, SignedOut } from ".";
import { useSignOut } from "@app/lib/hooks";
import SearchInput from "./SearchInput";
import { cn } from "@app/lib/utils";

type HeaderProps = {};

const Header: FC<HeaderProps> = ({}) => {
  const { mutate: signOut } = useSignOut();
  const pathname = usePathname();

  return (
    <header className="lg:py-5 fixed top-0 left-0 w-screen z-50">
      <div
        className={cn(
          "transition-all duration-500",
          pathname.includes("cloud") ? "sm:max-w-full px-10" : "lg:container",
        )}
      >
        <nav
          className={cn(
            "flex items-center gap-3 bg-white border-b lg:border filter-[blur(3px)] mx-auto p-3 lg:rounded-2xl",
          )}
        >
          <div className="flex-1 flex space-x-2 lg:space-x-3 items-center">
            <Link className="cursor-pointer" href="/">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchInput />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 text-sm rounded-lg">
                  <Menu />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="min-w-[150px] w-fit flex flex-col gap-2 rounded-lg p-2 shadow">
                <ul className="w-full">
                  <SignedOut>
                    <li>
                      <Link
                        className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                        href={`/sign-in`}
                      >
                        <LogIn size={16} /> Sign in
                      </Link>
                    </li>
                  </SignedOut>

                  <SignedIn>
                    <>
                      <li>
                        <Link
                          className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                          href={`/new-pin`}
                        >
                          <Pin size={16} /> New pin
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                          href={`/profile/me`}
                        >
                          <User size={16} /> Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                          href={`/cloud`}
                        >
                          <Cloud size={16} /> Cloud
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                          href={`/settings`}
                        >
                          <Settings size={16} /> Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex gap-2 items-center hover:bg-gray-200 p-2 py-2 rounded hover:text-black transition-all text-sm"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </li>
                    </>
                  </SignedIn>
                </ul>
              </PopoverContent>
            </Popover>

            <Button className="h-10 text-sm rounded-lg">
              Explore <ArrowRight size={16} />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

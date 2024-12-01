import { FC } from "react";

import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { ArrowRight, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";

import SearchInput from "./SearchInput";
import { Button, Popover, PopoverContent, PopoverTrigger } from "../shadcn";

type HeaderProps = {};

const Header: FC<HeaderProps> = async ({}) => {
  return (
    <header className="p-5 fixed top-0 left-0 w-screen z-50">
      <nav className="lg:max-w-6xl xl:max-w-7xl flex items-center gap-3 bg-shadow  border filter-[blur(3px)] mx-auto p-3 rounded-2xl">
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
                      <User size={16} /> My profile
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
                    <SignOutButton>
                      <div className="flex gap-2 items-center text-gray-500 hover:text-black py-1 transition-all text-sm">
                        <LogOut size={16} /> Sign out
                      </div>
                    </SignOutButton>
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
    </header>
  );
};

export default Header;

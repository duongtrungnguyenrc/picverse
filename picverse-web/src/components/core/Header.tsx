"use client";

import { ArrowRight, Cloud, LogIn, LogOut, Menu, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FC } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../shadcn";
import { CreateBoardDialog, Logo, SignedIn, SignedOut } from ".";
import { cn, preventSelectDefault } from "@app/lib/utils";
import { useSignOut } from "@app/lib/hooks";
import SearchInput from "./SearchInput";

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
          <div className="flex items-center space-x-2">
            <SearchInput />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 rounded-lg">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <SignedOut>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in" className="w-full flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Sign in</span>
                    </Link>
                  </DropdownMenuItem>
                </SignedOut>

                <SignedIn>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>New</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <Link className="w-full h-full" href="/new-pin">
                            Pin
                          </Link>
                        </DropdownMenuItem>

                        <CreateBoardDialog>
                          <DropdownMenuItem onSelect={preventSelectDefault}>Board</DropdownMenuItem>
                        </CreateBoardDialog>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem asChild>
                    <Link href="/me" className="w-full flex items-center">
                      <span>Profile</span>

                      <DropdownMenuShortcut>
                        <User className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cloud" className="w-full flex items-center">
                      <span>Cloud</span>

                      <DropdownMenuShortcut>
                        <Cloud className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full flex items-center">
                      <span>Settings</span>

                      <DropdownMenuShortcut>
                        <Settings className="h-4 w-4" />
                      </DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={preventSelectDefault}>
                        <span>Sign out</span>

                        <DropdownMenuShortcut>
                          <LogOut className="h-4 w-4" />
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently sign you out of your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => signOut()}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </SignedIn>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" className="h-10 text-sm rounded-lg">
              <span className="hidden lg:block">Explore</span> <ArrowRight size={16} />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

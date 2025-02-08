"use client";

import { FC } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  CreateBoardDialog,
} from "@app/components";
import { SlidersHorizontal, Plus, Pin, GalleryVerticalEnd, Clock, ArrowDownAZ } from "lucide-react";
import Link from "next/link";
import { preventSelectDefault } from "@app/lib/utils";

type ProfileBoardListingControlProps = {};

const ProfileBoardListingControl: FC<ProfileBoardListingControlProps> = ({}) => {
  return (
    <div className="flex-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gray-100 hover:bg-gray-200 hover:text-black" variant="secondary" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Creation tool</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <CreateBoardDialog>
              <DropdownMenuItem onSelect={preventSelectDefault}>
                Board
                <DropdownMenuShortcut>
                  <GalleryVerticalEnd className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </CreateBoardDialog>

            <DropdownMenuItem>
              <Link href="/new-pin" className="w-full flex items-center">
                <span>New pin</span>

                <DropdownMenuShortcut>
                  <Pin className="h-4 w-4" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sorting by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              A to Z
              <DropdownMenuShortcut>
                <ArrowDownAZ className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem>
              Created time
              <DropdownMenuShortcut>
                <Clock className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileBoardListingControl;

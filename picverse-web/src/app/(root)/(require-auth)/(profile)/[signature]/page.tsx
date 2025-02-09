import { FC } from "react";
import Link from "next/link";

import { SlidersHorizontal, Plus, Pin, GalleryVerticalEnd, Clock, ArrowDownAZ } from "lucide-react";
import {
  Profile,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  BoardListing,
  CreateBoardDialog,
  ProfileBoardListingControl,
} from "@app/components";

type Params = Promise<{ signature: string }>;

type ProfilePageProps = {
  params: Params;
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const { signature } = await params;

  return (
    <>
      <Profile signature={signature} />

      <Tabs defaultValue="created" className="mx-auto flex flex-col items-center mt-5">
        <div className="flex justify-between w-full mb-5">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <ProfileBoardListingControl />
        </div>
        <TabsContent value="created">
          <BoardListing />
        </TabsContent>
        <TabsContent value="saved">
          <BoardListing />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProfilePage;

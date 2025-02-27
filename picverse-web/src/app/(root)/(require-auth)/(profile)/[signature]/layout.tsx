import { FC, ReactNode } from "react";

import {
  Profile,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  BoardListing,
  ProfileBoardListingControl,
} from "@app/components";
import { loadProfile } from "@app/lib/actions";

type ProfileLayoutProps = {
  children: ReactNode;
  createdBoards: ReactNode;
  params: Promise<{ signature: string }>;
};

const ProfileLayout: FC<ProfileLayoutProps> = async ({ children, params, createdBoards }) => {
  const { signature } = await params;

  const profile: ProfileDetail = await loadProfile(signature != "me" ? signature : undefined);

  return (
    <div className="header-spacing">
      <div className="container">
        <Profile profile={profile} signature={signature} />

        <Tabs defaultValue="boards" className="mx-auto flex flex-col items-center mt-5">
          <div className="flex justify-between w-full mb-5">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="boards">Boards</TabsTrigger>
              <TabsTrigger value="informations">Informations</TabsTrigger>
            </TabsList>

            <ProfileBoardListingControl />
          </div>
          <TabsContent value="boards" className="w-full">
            {createdBoards}
          </TabsContent>
          <TabsContent value="informations">{/* <BoardListing /> */}</TabsContent>
        </Tabs>

        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;

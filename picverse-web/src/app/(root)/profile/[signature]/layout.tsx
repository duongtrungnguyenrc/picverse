import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

import { Profile, Tabs, TabsContent, TabsList, TabsTrigger, ProfileBoardListingControl } from "@app/components";
import { loadProfile } from "@app/lib/actions";

type ProfileLayoutProps = {
  children: ReactNode;
  createdBoards: ReactNode;
  informations: ReactNode;
  params: Promise<{ signature: string }>;
};

const ProfileLayout = async ({ children, params, createdBoards, informations }: ProfileLayoutProps) => {
  const { signature } = await params;

  console.log(signature);

  const profile: ProfileDetail | null = await loadProfile(signature != "me" ? signature : undefined);

  if (!profile) notFound();

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
          <TabsContent value="informations" className="w-full">
            {informations}
          </TabsContent>
        </Tabs>
      </div>

      {children}
    </div>
  );
};

export default ProfileLayout;

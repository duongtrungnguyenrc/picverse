import { FC } from "react";

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

type Params = Promise<{ signature: string }>;

type ProfilePageProps = {
  params: Params;
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const { signature } = await params;

  const profile: ProfileDetail = await loadProfile(signature != "me" ? signature : undefined);

  return (
    <>
      <Profile profile={profile} signature={signature} />

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

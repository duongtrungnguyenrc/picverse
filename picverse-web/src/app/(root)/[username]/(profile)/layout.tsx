import { Profile } from "@app/components";
import { FC, ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components";

type Params = Promise<{ username: string }>;

type ProfilePageLayoutProps = {
  params: Params;
  createdcollections: ReactNode;
  savedcollections: ReactNode;
};

const ProfilePageLayout: FC<ProfilePageLayoutProps> = async ({
  params,
  createdcollections,
  savedcollections,
}) => {
  const { username } = await params;

  return (
    <div className="container">
      <Profile username={username} />

      <Tabs
        defaultValue="created"
        className="mx-auto flex flex-col items-center mt-5"
      >
        <TabsList>
          <TabsTrigger value="created">Created collections</TabsTrigger>
          <TabsTrigger value="saved">Saved collections</TabsTrigger>
        </TabsList>
        <TabsContent value="created">{createdcollections}</TabsContent>
        <TabsContent value="saved">{savedcollections}</TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePageLayout;

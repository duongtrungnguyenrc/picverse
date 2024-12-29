import { FC, ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components";

type ProfilePageLayoutProps = {
  createdcollections: ReactNode;
  savedcollections: ReactNode;
  children: ReactNode;
};

const ProfilePageLayout: FC<ProfilePageLayoutProps> = async ({ createdcollections, savedcollections, children }) => {
  return (
    <div className="container">
      {children}

      <Tabs defaultValue="created" className="mx-auto flex flex-col items-center mt-5">
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

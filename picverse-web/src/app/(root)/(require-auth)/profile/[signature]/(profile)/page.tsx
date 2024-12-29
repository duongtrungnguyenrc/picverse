import { FC } from "react";

import { Profile } from "@app/components";

type Params = Promise<{ signature: string }>;

type ProfilePageProps = {
  params: Params;
};

const ProfilePage: FC<ProfilePageProps> = async ({ params }) => {
  const { signature } = await params;

  return <Profile signature={signature} />;
};

export default ProfilePage;

import { FC } from "react";

import { SettingProfileForm } from "@app/components";
import { loadProfile } from "@app/lib/actions";

type SettingProfilePageProps = {};

const SettingProfilePage: FC<SettingProfilePageProps> = async ({}) => {
  const profile = await loadProfile();
  return <SettingProfileForm profile={profile} />;
};

export default SettingProfilePage;

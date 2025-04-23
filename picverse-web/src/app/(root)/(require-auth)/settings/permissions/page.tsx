import { ContentSection, Label, RadioGroup, RadioGroupItem, SettingPermissionsForm, Switch } from "@app/components";
import { loadAccountConfig } from "@app/lib/actions";
import { FC } from "react";

type SettingPermissionsPageProps = {};

const SettingPermissionsPage: FC<SettingPermissionsPageProps> = async ({}) => {
  const config = await loadAccountConfig();

  return <SettingPermissionsForm config={config} />;
};

export default SettingPermissionsPage;

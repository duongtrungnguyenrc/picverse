import { ContentSection, Label, Switch } from "@app/components";
import { FC } from "react";

type SettingNotificationsPageProps = {};

const SettingNotificationsPage: FC<SettingNotificationsPageProps> = ({}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="in-app-notifications">In-app notifications</Label>
          <p className="text-sm text-muted-foreground">
            Choose notifications you want to receive when using Picverse website or app
          </p>
        </div>
        <Switch id="in-app-notifications" />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="email-notifications">Email notifications</Label>
          <p className="text-sm text-muted-foreground">Choose notifications you want to receive by email</p>
        </div>
        <Switch id="email-notifications" />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="push-notifications">Push notifications</Label>
          <p className="text-sm text-muted-foreground">Choose notifications you want to receiveby push notifications</p>
        </div>
        <Switch id="push-notifications" />
      </div>
    </div>
  );
};

export default SettingNotificationsPage;

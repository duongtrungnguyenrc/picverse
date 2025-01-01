import { ContentSection, Label, RadioGroup, RadioGroupItem, Switch } from "@app/components";
import { FC } from "react";

type SettingPermissionsPageProps = {};

const SettingPermissionsPage: FC<SettingPermissionsPageProps> = ({}) => {
  return (
    <div className="space-y-8 pb-10">
      <ContentSection heading="Mentions" subHeading="Choose who can mention you">
        <RadioGroup className="space-y-2" defaultValue="everyone">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="everyone" id="mention-1" />
            <Label htmlFor="mention-1">Everyone on Pinterest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="followers" id="mention-2" />
            <Label htmlFor="mention-2">Only people you follow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="off" id="mention-3" />
            <Label htmlFor="mention-3">Off</Label>
          </div>
        </RadioGroup>
      </ContentSection>

      <ContentSection
        heading="Messages"
        subHeading="Decide if messages go to your inbox, requests list, or if you don't receive them at all"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Friends</h3>
              <p className="text-sm text-muted-foreground">Inbox</p>
            </div>
            <button className="text-primary">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Followers</h3>
              <p className="text-sm text-muted-foreground">Requests</p>
            </div>
            <button className="text-primary">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Following</h3>
              <p className="text-sm text-muted-foreground">Requests</p>
            </div>
            <button className="text-primary">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Everyone else</h3>
              <p className="text-sm text-muted-foreground">Requests</p>
            </div>
            <button className="text-primary">Edit</button>
          </div>
        </div>
      </ContentSection>

      <ContentSection heading="Comments" subHeading="Allow comments on your Pins">
        <div className="flex items-center justify-between">
          <Label htmlFor="comments">Comments will be on by default for your new and existing Pins</Label>
          <Switch id="comments" />
        </div>
      </ContentSection>

      <ContentSection heading="Pin Video downloads" subHeading="Allow downloads and sharing">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="video-download">
              Allow people to download your Pin Videos (9:16 ratio) and share them to other platforms
            </Label>
            <p className="text-sm text-muted-foreground">These videos will display a watermark with your username</p>
          </div>
          <Switch id="video-download" />
        </div>
      </ContentSection>

      <ContentSection heading="Auto-play videos" subHeading="Control video playback">
        <div className="flex items-center justify-between">
          <Label htmlFor="autoplay">Auto-play videos on desktop</Label>
          <Switch id="autoplay" defaultChecked />
        </div>
      </ContentSection>
    </div>
  );
};

export default SettingPermissionsPage;

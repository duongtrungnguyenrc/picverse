import { Card, CardContent, ContentSection, Label } from "@app/components";
import { CheckCheck } from "lucide-react";
import { FC } from "react";

type SettingCredentialsPageProps = {};

const SettingCredentialsPage: FC<SettingCredentialsPageProps> = ({}) => {
  return (
    <div>
      <ContentSection
        className="space-y-3"
        heading="Authentication credentials"
        subHeading="Manage your authentication credentials"
      >
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">Google oauth credentials</h3>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span className="text-sm font-medium">Verified</span>
                <CheckCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentSection>

      <ContentSection className="space-y-3" heading="Cloud credentials" subHeading="Manage your cloud credentials">
        <div className="space-y-4">
          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Google Drive</h3>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-sm font-medium">Connected</span>
                  <CheckCheck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Dropbox</h3>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-sm font-medium">Connected</span>
                  <CheckCheck className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </div>
  );
};

export default SettingCredentialsPage;

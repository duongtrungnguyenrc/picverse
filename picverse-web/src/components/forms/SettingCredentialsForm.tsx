"use client";

import { FC } from "react";

import { Card, CardContent, ContentSection } from "@app/components";
import { CheckCheck, X } from "lucide-react";
import { useExternalStorageLinkStatus } from "@app/lib/hooks";
import { cn } from "@app/lib/utils";

type SettingCredentialsFormProps = {};

const SettingCredentialsForm: FC<SettingCredentialsFormProps> = ({}) => {
  const { data } = useExternalStorageLinkStatus();
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
          {Object.entries(data || {}).map(([key, value]) => {
            return (
              <Card key={`setting:cloud:credentials:${key}`} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{key}</h3>
                    </div>
                    <div
                      className={cn("flex items-center gap-2 text-primary", value ? "text-primary" : "text-red-500")}
                    >
                      <span className="text-sm font-medium">{value ? "Connected" : "No connected"}</span>
                      {value ? <CheckCheck className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ContentSection>
    </div>
  );
};

export default SettingCredentialsForm;

"use client";

import { ChevronRight, ShieldCheck } from "lucide-react";
import { FC } from "react";

import { ContentSection, ChangePasswordDialog, LoginHistoryDialog } from "@app/components";
import Setting2FADialog from "@app/components/core/Setting2FADialog";
import { useAuth } from "@app/lib/hooks";

type SettingAccountPageProps = {};

const SettingAccountPage: FC<SettingAccountPageProps> = ({}) => {
  const { account } = useAuth();

  return (
    <div>
      <ContentSection
        heading="Login & security"
        subHeading="Manage your passwords, login preferences and recovery methods."
      >
        <ul className="rounded-xl border overflow-hidden">
          <ChangePasswordDialog>
            <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
              Change password
              <ChevronRight size={20} />
            </li>
          </ChangePasswordDialog>

          <hr />

          <Setting2FADialog>
            <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
              Two factor authentication
              <div className="flex items-center space-x-2">
                {account?.enable2FA ? (
                  <>
                    <ShieldCheck className="text-primary" size={16} />
                    <span className="text-primary">Enabled</span>
                  </>
                ) : (
                  <span className="text-gray-400">Disabled</span>
                )}

                <ChevronRight size={20} />
              </div>
            </li>
          </Setting2FADialog>

          <hr />

          <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
            Saved account
            <ChevronRight size={20} />
          </li>
        </ul>
      </ContentSection>

      <ContentSection
        heading="Security checks"
        subHeading="Review security issues by running checks across apps, devices and emails sent."
      >
        <ul className="rounded-xl border">
          <LoginHistoryDialog>
            <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
              Login history
              <ChevronRight size={20} />
            </li>
          </LoginHistoryDialog>
          <hr />
          <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
            Where you&apos;re logged in
            <ChevronRight size={20} />
          </li>
        </ul>
      </ContentSection>
    </div>
  );
};

export default SettingAccountPage;

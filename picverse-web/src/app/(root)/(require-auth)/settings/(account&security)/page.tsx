import { ChevronRight, ShieldCheck } from "lucide-react";
import { FC } from "react";

import { ContentSection, ChangePasswordDialog, LoginHistoryDialog, WhreLoggedInDialog } from "@app/components";
import { Setting2FADialog } from "@app/components";
import { loadAccountConfig } from "@app/lib/actions";

type SettingAccountPageProps = {};

const SettingAccountPage: FC<SettingAccountPageProps> = async ({}) => {
  const config = await loadAccountConfig();

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

          <Setting2FADialog config={config}>
            <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
              Two factor authentication
              <div className="flex items-center space-x-2">
                {config?.enable2FA ? (
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
          <WhreLoggedInDialog>
            <li className="text-sm flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-all font-medium">
              Where you&apos;re logged in
              <ChevronRight size={20} />
            </li>
          </WhreLoggedInDialog>
        </ul>
      </ContentSection>
    </div>
  );
};

export default SettingAccountPage;

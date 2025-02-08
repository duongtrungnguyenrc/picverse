import { FC, ReactNode } from "react";

type ProfileLayoutProps = {
  children: ReactNode;
};

const ProfileLayout: FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="header-spacing">
      <div className="container">{children}</div>
    </div>
  );
};

export default ProfileLayout;

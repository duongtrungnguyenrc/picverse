import { FC, ReactNode } from "react";

type ProfilePageGroupLayoutProps = {
  children: ReactNode;
};

const ProfilePageGroupLayout: FC<ProfilePageGroupLayoutProps> = ({ children }) => {
  return <div className="header-spacing">{children}</div>;
};

export default ProfilePageGroupLayout;

import { FC, ReactNode } from "react";

import { AuthDetect } from "@app/components";

type RequireAuthLayoutProps = {
  children: ReactNode;
};

const RequireAuthLayout: FC<RequireAuthLayoutProps> = ({ children }) => {
  return (
    <AuthDetect navigationTo={"/sign-in"} isSignedIn={true}>
      {children}
    </AuthDetect>
  );
};

export default RequireAuthLayout;

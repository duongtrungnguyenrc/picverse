import { AuthDetect } from "@app/components";
import { FC, ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <AuthDetect navigationTo="/" isSignedIn={false}>
      {children}
    </AuthDetect>
  );
};

export default AuthLayout;

import { FC, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type SignedInProps = {
  children: ReactNode;
};

const SignedIn: FC<SignedInProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated && children;
};

export default SignedIn;

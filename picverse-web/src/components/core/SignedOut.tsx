import { FC, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type SignedOutProps = {
  children: ReactNode;
};

const SignedOut: FC<SignedOutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated && children;
};

export default SignedOut;

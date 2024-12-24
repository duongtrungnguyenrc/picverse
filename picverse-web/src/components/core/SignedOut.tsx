import { FC, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type SignedOutProps = {
  children: ReactNode;
};

const SignedOut: FC<SignedOutProps> = ({ children }) => {
  const { ready, account } = useAuth();

  return (!ready || !account) && children;
};

export default SignedOut;

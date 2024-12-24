import { FC, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type SignedInProps = {
  children: ReactNode;
};

const SignedIn: FC<SignedInProps> = ({ children }) => {
  const { ready, account } = useAuth();

  return ready && account && children;
};

export default SignedIn;

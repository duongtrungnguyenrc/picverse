import { FC, ReactNode } from "react";

import { auth } from "@app/lib/actions";
import { AuthProvider } from "../providers";

type AuthorizationProps = {
  children: ReactNode;
};

const Authorization: FC<AuthorizationProps> = async ({ children }) => {
  const authState = await auth();

  return <AuthProvider authState={authState}>{children}</AuthProvider>;
};

export default Authorization;

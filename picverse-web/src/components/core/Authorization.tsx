import { FC, ReactNode } from "react";

import { getCookie, loadAuthAccount } from "@app/lib/actions";
import { AuthProvider } from "../providers";

type AuthorizationProps = {
  children: ReactNode;
};

const Authorization: FC<AuthorizationProps> = async ({ children }) => {
  const [accessToken, refreshToken] = await Promise.all([
    getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX),
    getCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX),
  ]);
  const account = await loadAuthAccount(accessToken);

  return (
    <AuthProvider account={account} tokenPair={{ accessToken, refreshToken }}>
      {children}
    </AuthProvider>
  );
};

export default Authorization;

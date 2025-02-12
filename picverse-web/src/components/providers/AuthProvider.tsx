"use client";

import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { clearAuthCookie, getCookie } from "@app/lib/actions";
import { AuthContext } from "@app/lib/contexts";
import { httpClient } from "@app/lib/utils";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<Pick<AuthContext, "ready" | "account">>({
    ready: false,
  });

  useEffect(() => {
    authorizeClient();

    const interval = setInterval(
      () => {
        authorizeClient();
      },
      30 * 60 * 1000,
    );

    const handleFocus = () => authorizeClient();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const authorizeClient = useCallback(async (actions?: { onSuccess?: VoidFunction; onFailed?: VoidFunction }) => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX),
        getCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX),
      ]);

      if (!accessToken && !refreshToken) {
        throw new Error();
      }

      const response = await httpClient.get<Account>("/account");

      actions?.onSuccess?.();
      setState({ account: response.data, ready: true });
    } catch (error) {
      actions?.onFailed?.();
      setState({ account: undefined, ready: true });
    }
  }, []);

  const clearAuth = useCallback(() => {
    setState((prevState) => ({ ...prevState, account: undefined }));
    clearAuthCookie();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        authorizeClient,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

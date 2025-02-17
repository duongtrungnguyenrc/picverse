"use client";

import { type FC, type ReactNode, useCallback, useEffect, useState, useRef } from "react";
import { clearAuthCookie, getCookie } from "@app/lib/actions";
import { AuthContext } from "@app/lib/contexts";
import { httpClient } from "@app/lib/utils";

type AuthProviderProps = {
  children: ReactNode;
};

const SLATE_TIME = 5 * 60 * 1000;

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<Pick<AuthContextType, "ready" | "account" | "accessToken" | "refreshToken">>({
    ready: false,
  });
  const lastFetchTime = useRef<number>(0);

  useEffect(() => {
    authorizeClient();

    const interval = setInterval(
      () => {
        authorizeClient();
      },
      30 * 60 * 1000,
    );

    const handleFocus = () => {
      const currentTime = Date.now();
      if (currentTime - lastFetchTime.current > SLATE_TIME) {
        authorizeClient();
      }
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const authorizeClient = useCallback(async (actions?: { onSuccess?: VoidFunction; onFailed?: VoidFunction }) => {
    try {
      setState((prev) => ({ ...prev, ready: false }));

      const [accessToken, refreshToken] = await Promise.all([
        getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX),
        getCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX),
      ]);

      if (!accessToken && !refreshToken) {
        throw new Error();
      }

      const response = await httpClient.get<Account>("/account");

      actions?.onSuccess?.();
      setState({ account: response.data, ready: true, accessToken, refreshToken });
      lastFetchTime.current = Date.now();
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

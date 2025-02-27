"use client";

import { type FC, type ReactNode, useEffect, useRef } from "react";

import { revalidateAuth, signOut } from "@app/lib/actions";
import { AuthContext } from "@app/lib/contexts";
import { useAuthCheck } from "@app/lib/hooks";

type AuthProviderProps = {
  children: ReactNode;
  authState: Auth;
};

const SLATE_TIME = 60 * 60 * 1000;

const AuthProvider: FC<AuthProviderProps> = ({ children, authState }) => {
  const lastFetchTime = useRef<number>(Date.now());
  useAuthCheck();

  useEffect(() => {
    const handleFocus = () => {
      const currentTime = Date.now();
      if (currentTime - lastFetchTime.current > SLATE_TIME) {
        revalidateAuth();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [lastFetchTime]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthenticated: !!authState.account,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

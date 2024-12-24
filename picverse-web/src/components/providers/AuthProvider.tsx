"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FC, ReactNode, useCallback } from "react";

import { useAuthorizeClient } from "@app/lib/hooks";
import { AuthContext } from "@app/lib/contexts";
import { QueryKeys } from "@app/lib/constants";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { data, isPending, refetch } = useAuthorizeClient();
  const queryClient = useQueryClient();

  const clearAuth = useCallback(async () => {
    await queryClient.resetQueries({ queryKey: [QueryKeys.GET_ACCOUNT] });
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        account: data,
        ready: !isPending,
        authorizeClient: refetch,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

"use client";

import { useState, useEffect } from "react";

import { getCookie } from "../actions";
import { useAuth } from "./use-auth";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const { ready, account } = useAuth();

  const fetchAuthCookie = async () => {
    const cookieToken: string | undefined = await getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);

    if (cookieToken) {
      setToken(cookieToken);
    }
  };

  useEffect(() => {
    if (ready) {
      fetchAuthCookie();
    }
  }, [ready, account]);

  return { token, ready, accountId: account?._id };
}

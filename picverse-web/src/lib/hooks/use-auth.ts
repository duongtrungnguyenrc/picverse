"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useContext, useEffect } from "react";

import { httpClient, showAxiosToastError } from "../utils";
import { ACCESS_TOKEN_PREFIX, AuthTags, MutationKeys, QueryKeys } from "../constants";
import { AuthContext } from "../contexts";
import { getAuthCookie, getClientSecret, googleSignIn, refreshToken, signOut } from "../actions";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => useContext(AuthContext);

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;
const TOKEN_THRESHOLD = 5 * 60 * 1000;

export const useAuthCheck = () => {
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = await getAuthCookie(ACCESS_TOKEN_PREFIX);

      if (!accessToken) {
        refreshToken();
        return;
      }

      const decoded: { exp: number } = jwtDecode(accessToken);
      const expiresAt = new Date(decoded.exp * 1000).getTime();
      const now = Date.now();

      if (expiresAt - now < TOKEN_THRESHOLD) {
        refreshToken();
      }
    };
    checkToken();

    const interval = setInterval(checkToken, TOKEN_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);
};

export default useAuthCheck;

export const useSession = () => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await fetch("/api/sessions", {
        next: {
          tags: [AuthTags.TOKENS],
          revalidate: 60 * 60, // 1 hours in minutes
        },
      });

      return response.json();
    },
  });
};

export const useGoogleSignIn = () => {
  const mutationResult = useMutation<void, AxiosError>({
    mutationKey: [MutationKeys.GOOGLE_SIGN_IN],
    mutationFn: async () => {
      const secret = await getClientSecret();
      await googleSignIn(secret);
    },
  });

  return {
    ...mutationResult,
  };
};

export const useSignOut = () => {
  return useMutation<void, AxiosError>({
    mutationKey: [MutationKeys.SIGN_OUT],
    mutationFn: signOut,
    onSuccess: async () => {
      toast.success("Sign out success");
    },
    onError: showAxiosToastError,
  });
};

export const useEnable2FA = () => {
  return useMutation<string, AxiosError>({
    mutationFn: async () => {
      const response = await httpClient.post<string>("/auth/2fa/enable");
      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useDisable2FA = () => {
  return useMutation<StatusResponse, AxiosError, Disable2FARequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post<StatusResponse>("/auth/2fa/disable", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: showAxiosToastError,
  });
};

export const useVerify2FA = () => {
  return useMutation<StatusResponse, AxiosError, Verify2FARequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post("/auth/2fa/verify", data);

      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useClientSecret = () =>
  useQuery<string>({
    queryKey: [QueryKeys.CLIENT_SECRET],
    queryFn: async () => await getClientSecret(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
  });

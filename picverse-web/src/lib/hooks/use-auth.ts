"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generate } from "randomstring";
import { toast } from "react-hot-toast";
import { useContext } from "react";

import { httpClient, showAxiosToastError } from "../utils";
import { AuthTags, MutationKeys, QueryKeys } from "../constants";
import { AuthContext } from "../contexts";
import { getClientSecret, googleSignIn, signOut } from "../actions";

export const useAuth = () => useContext(AuthContext);

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

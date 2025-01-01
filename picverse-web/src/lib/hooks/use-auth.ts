"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generate } from "randomstring";
import { toast } from "react-hot-toast";
import { useContext } from "react";

import { httpClient, showAxiosToastError } from "../utils";
import { MutationKeys, QueryKeys } from "../constants";
import { AuthContext } from "../contexts";

export const useAuth = () => useContext(AuthContext);

export const useSignIn = () => {
  return useMutation<TokenPair | Require2FAResponse, AxiosError, SignInRequest>({
    mutationKey: [MutationKeys.SIGN_IN],
    mutationFn: async (data) => {
      const response = await httpClient.post<TokenPair | Require2FAResponse>("/auth/sign-in", data);

      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useSignInWith2FA = () => {
  return useMutation<TokenPair, AxiosError, SignInWithTwoFactorRequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post<TokenPair>("/auth/sign-in/2fa", data);
      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useGoogleSignIn = () => {
  const { data: secret } = useClientSecret();
  const router = useRouter();

  const mutationResult = useMutation<void, AxiosError>({
    mutationKey: [MutationKeys.GOOGLE_SIGN_IN],
    mutationFn: async () => {
      router.push(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/auth/oauth?platform=google&secret=${secret}`);
    },
  });

  return {
    ...mutationResult,
  };
};

export const useSignOut = () => {
  const { clearAuth } = useAuth();

  return useMutation<StatusResponse, AxiosError>({
    mutationKey: [MutationKeys.SIGN_OUT],
    mutationFn: async () => {
      const response = await httpClient.post<StatusResponse>("/auth/sign-out");
      return response.data;
    },
    onSuccess: (data) => {
      clearAuth();
      toast.success(data.message);
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
    queryFn: async () => {
      let secret = localStorage.getItem("authSecret");

      if (!secret) {
        secret = generate({ length: 32 }) + Date.now().toString();
        localStorage.setItem("authSecret", secret);
      }
      return secret;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
  });

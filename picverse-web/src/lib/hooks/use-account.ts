"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generate } from "randomstring";
import { toast } from "react-hot-toast";

import { MutationKeys, QueryKeys } from "../constants";
import { httpClient } from "../utils";
import { useAuth } from "./use-auth";

export const useSignIn = () =>
  useMutation<TokenPair, AxiosError, SignInDto>({
    mutationKey: [MutationKeys.SIGN_IN],
    mutationFn: async (data) => {
      const response = await httpClient.post<TokenPair>("/accounts/sign-in", data);

      return response.data;
    },
  });

export const useGoogleSignIn = () => {
  const { data: secret } = useClientSecret();
  const router = useRouter();

  const mutationResult = useMutation<void, AxiosError>({
    mutationKey: [MutationKeys.GOOGLE_SIGN_IN],
    mutationFn: async () => {
      router.push(`http://localhost:3000/api/accounts/sign-in?platform=google&secret=${secret}`);
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
      const response = await httpClient.post<StatusResponse>("/accounts/sign-out");
      clearAuth();
      toast.success(response.data.message);

      return response.data;
    },
  });
};

export const useClientSecret = () =>
  useQuery<string>({
    queryKey: [QueryKeys.GET_CLIENT_SECRET],
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

export const useAuthorizeClient = () =>
  useQuery<Account, AxiosError>({
    queryKey: [QueryKeys.GET_ACCOUNT],
    queryFn: async () => {
      const response = await httpClient.post<Account>("/accounts/authorize");

      return response.data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: false,
    staleTime: 0,
  });

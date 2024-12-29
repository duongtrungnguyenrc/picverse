"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generate } from "randomstring";
import { toast } from "react-hot-toast";

import { httpClient, showAxiosToastError } from "../utils";
import { MutationKeys, QueryKeys } from "../constants";
import { setAuthCookie } from "../actions";
import { useAuth } from "./use-auth";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, SignUpRequest>({
    mutationKey: [MutationKeys.SIGN_UP],
    mutationFn: async (data) => {
      const response = await httpClient.post<StatusResponse>("/accounts/sign-up", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Sign up success");
      router.replace("/sign-in");
    },
    onError: showAxiosToastError,
  });
};

export const useSignIn = () => {
  const { authorizeClient, ready } = useAuth();

  const result = useMutation<TokenPair, AxiosError, SignInRequest>({
    mutationKey: [MutationKeys.SIGN_IN],
    mutationFn: async (data) => {
      const response = await httpClient.post<TokenPair>("/accounts/sign-in", data);

      return response.data;
    },
    onSuccess: async (data) => {
      await setAuthCookie(data);
      authorizeClient();

      toast.success("Sign in success");
    },
    onError: showAxiosToastError,
  });

  return {
    ...result,
    isPending: result.isPending || !ready,
  };
};

export const useGoogleSignIn = () => {
  const { data: secret } = useClientSecret();
  const router = useRouter();

  const mutationResult = useMutation<void, AxiosError>({
    mutationKey: [MutationKeys.GOOGLE_SIGN_IN],
    mutationFn: async () => {
      router.push(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/accounts/sign-in?platform=google&secret=${secret}`);
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
      return response.data;
    },
    onSuccess: (data) => {
      clearAuth();
      toast.success(data.message);
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

export const useForgotPassword = () => {
  return useMutation<string, AxiosError, ForgotPasswordRequest>({
    mutationKey: [MutationKeys],
    mutationFn: async (data) => {
      const response = await httpClient.post<string>("/accounts/forgot-password", data);

      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, ResetPasswordRequest>({
    mutationKey: [MutationKeys],
    mutationFn: async (data) => {
      const response = await httpClient.post<StatusResponse>("/accounts/reset-password", data);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.replace("/sign-in");
    },
    onError: showAxiosToastError,
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { httpClient, showAxiosToastError } from "../utils";
import { MutationKeys } from "../constants";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, SignUpRequest>({
    mutationKey: [MutationKeys.SIGN_UP],
    mutationFn: async (data) => {
      const response = await httpClient.post<StatusResponse>("/account/sign-up", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Sign up success");
      router.replace("/sign-in");
    },
    onError: showAxiosToastError,
  });
};

export const useForgotPassword = () => {
  return useMutation<string, AxiosError, ForgotPasswordRequest>({
    mutationKey: [MutationKeys.FORGOT_PASSWORD],
    mutationFn: async (data) => {
      const response = await httpClient.post<string>("/account/forgot-password", data);

      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, ResetPasswordRequest>({
    mutationKey: [MutationKeys.RESET_PASSWORD],
    mutationFn: async (data) => {
      const response = await httpClient.post<StatusResponse>("/account/reset-password", data);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.replace("/sign-in");
    },
    onError: showAxiosToastError,
  });
};

export const useChangePassword = () => {
  return useMutation<StatusResponse, AxiosError, ChangePasswordRequest>({
    mutationKey: [MutationKeys.CHANGE_PASSWORD],
    mutationFn: async (data) => {
      const response = await httpClient.put<StatusResponse>("/account/password", data);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: showAxiosToastError,
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { MutationKeys } from "../constants";
import { httpClient, showAxiosToastError } from "../utils";

export const useUpdateProfile = () => {
  return useMutation<StatusResponse, AxiosError, UpdateProfileRequest>({
    mutationKey: [MutationKeys.UPDATE_PROFILE],
    mutationFn: async (profile) => {
      const response = await httpClient.put<StatusResponse>("/profile", profile);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: showAxiosToastError,
  });
};

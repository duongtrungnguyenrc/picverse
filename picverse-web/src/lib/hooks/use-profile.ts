"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { httpFetchClient, showToastError } from "../utils";
import { revalidateProfile } from "../actions";

export const useUpdateProfile = () => {
  return useMutation<StatusResponse, Error, UpdateProfileRequest>({
    mutationFn: (data) => httpFetchClient.put<StatusResponse>("/profile", JSON.stringify(data)),
    onSuccess: async (data) => {
      await revalidateProfile();
      toast.success(data.message);
    },
    onError: showToastError,
  });
};

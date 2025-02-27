"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { showToastError } from "../utils";
import { updateProfile } from "../actions";

export const useUpdateProfile = () => {
  return useMutation<StatusResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: showToastError,
  });
};

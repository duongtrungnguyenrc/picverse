"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { MutationKeys, QueryKeys } from "../constants";
import { httpClient, showAxiosToastError } from "../utils";
import toast from "react-hot-toast";

export const useProfile = (id?: string) => {
  return useQuery<Profile, AxiosError>({
    queryKey: [QueryKeys.PROFILE, id],
    queryFn: async () => {
      const response = await httpClient.get<Profile>(`/profile${id ? `/${id}` : ""}`);

      return response.data;
    },
  });
};

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

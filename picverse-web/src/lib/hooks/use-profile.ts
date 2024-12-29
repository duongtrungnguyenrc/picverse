"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpClient } from "../utils";

export const useProfile = (id?: string) => {
  return useQuery<Profile, AxiosError>({
    queryKey: [QueryKeys.PROFILE, id],
    queryFn: async () => {
      const response = await httpClient.get<Profile>(`/profiles${id ? `/${id}` : ""}`);

      console.log("res", response);

      return response.data;
    },
  });
};

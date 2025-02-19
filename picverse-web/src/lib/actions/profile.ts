"use server";

import { httpClient } from "../utils";

export const loadProfile = async (id?: string): Promise<ProfileDetail> => {
  const query = new URLSearchParams({
    ...(id ? { id } : {}),
  });

  const response = await httpClient.get<ProfileDetail>(`/profile?${query}`);

  return response.data;
};

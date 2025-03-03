"use server";

import { ProfileTags } from "../constants";
import { httpFetchClient } from "../utils";

export const loadProfile = async (signature?: string): Promise<ProfileDetail | null> => {
  try {
    const response = await httpFetchClient.get<ProfileDetail>("/profile", {
      query: { signature },
      next: {
        tags: [ProfileTags.PROFILE],
      },
    });

    return response;
  } catch (error) {
    return null;
  }
};

export const updateProfile = async (payload: UpdateProfileRequest) => {
  return await httpFetchClient.put<StatusResponse>("/profile", JSON.stringify(payload));
};

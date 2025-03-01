"use server";

import { BoardTags } from "../constants";
import { httpFetchClient } from "../utils";

export const loadProfile = async (id?: string): Promise<ProfileDetail | null> => {
  try {
    const response = await httpFetchClient.get<ProfileDetail>("/profile", {
      query: { id },
      next: {
        tags: [BoardTags.USER_BOARDS],
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

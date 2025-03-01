"use server";

import { httpFetchClient, objectToFormData } from "../utils";
import { revalidateCloudResources } from "./cloud";

export const getPinDetail = async (pinId: string, raw: boolean = true): Promise<PinDetail | null> => {
  try {
    const response = await httpFetchClient.get<PinDetail>(`/pin/${pinId}`);

    return response;
  } catch (error) {
    if (raw) return null;

    throw error;
  }
};

export async function createPin(payload: CreatePinRequest) {
  const response = await httpFetchClient.post<StatusResponse>("/pin", objectToFormData(payload));
  revalidateCloudResources();

  return response;
}

export async function getSimilarPins(pinId: string, page: number = 1) {
  const response = await httpFetchClient.get<InfiniteResponse<Pin>>(`/pin/similar/${pinId}/`, {
    query: {
      page: page,
      limit: 20,
    },
  });

  return response;
}

export async function getPinComments(pinId: string, page: number = 1) {
  const response = await httpFetchClient.get<InfiniteResponse<Cmt>>(`/pin/${pinId}/comments`, {
    query: {
      page: page,
      limit: 20,
    },
  });

  return response;
}

"use server";

import { httpFetchClient } from "../utils";

export const getPinDetail = async (pinSignature: string, raw: boolean = true): Promise<PinDetail | null> => {
  try {
    const response = await httpFetchClient.get<PinDetail>(`/pin/${pinSignature}`);

    return response;
  } catch (error) {
    console.log(error);
    if (raw) return null;

    throw error;
  }
};

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

export async function loadPinByBoard(boardSignature: string, pagination?: Pagination) {
  return await httpFetchClient.get<PaginationResponse<Pin>>(`/pin/${boardSignature}/all`, {
    query: pagination,
  });
}

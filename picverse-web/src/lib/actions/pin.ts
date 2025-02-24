"use server";

import { httpClient } from "../utils";

export const getPinDetail = async (pinId: string): Promise<PinDetail> => {
  const response = await httpClient.get<PinDetail>(`/pin/${pinId}`);

  return response.data;
};

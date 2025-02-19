"use server";

import { httpClient } from "../utils";

export const loadFirstPageResources = async (parentId?: string): Promise<GetResourcesResponse> => {
  const query = new URLSearchParams({
    page: String(1),
    limit: String(30),
  });

  const response = await httpClient.get<GetResourcesResponse>(
    `/cloud/resources${parentId ? `?parentId=${parentId}` : ""}?${query}`,
  );

  return response.data;
};

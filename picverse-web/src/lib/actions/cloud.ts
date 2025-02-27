"use server";

import { revalidateTag } from "next/cache";
import { httpClient, httpFetchClient } from "../utils";

export const loadResources = async (
  parentId?: string,
  page?: number,
  limit?: number,
): Promise<GetResourcesResponse> => {
  const query = new URLSearchParams();

  if (page !== undefined) query.append("page", String(page));
  if (limit !== undefined) query.append("limit", String(limit));
  if (parentId) query.append("parentId", parentId);

  const response = await httpFetchClient.get<GetResourcesResponse>(`/cloud/resources?${query}`, {
    next: { revalidate: 5, tags: ["resources"] },
  });

  return response;
};

export const createFolder = async (payload: CreateFolderRequest, parentId?: string) => {
  const response = await httpClient.post<StatusResponse>("/cloud/folder", { ...payload, parentId });

  revalidateTag("resources")
  return response.data;
};

"use server";

import { revalidateTag } from "next/cache";
import "server-only";

import { httpFetchClient } from "../utils";
import { CloudTags } from "../constants";

export const loadResources = async (parentId?: string, pagination?: Pagination): Promise<GetResourcesResponse> => {
  return await httpFetchClient.get<GetResourcesResponse>("/cloud/resources", {
    next: { revalidate: 5, tags: [CloudTags.RESOURCES] },
    query: {
      parentId,
      ...pagination,
    },
  });
};

export const revalidateCloudResources = async () => revalidateTag(CloudTags.RESOURCES);

export const uploadFile = async (payload: UploadFileRequest) => {
  const { parentId, ...restPayload } = payload;

  const data = new FormData();
  Object.entries(restPayload).forEach(([key, value]) => value && data.append(key, value));

  const response = await httpFetchClient.post<StatusResponse>("/cloud/file", data, {
    query: {
      parentId,
    },
  });

  await revalidateCloudResources();
  return response;
};

export const createFolder = async (payload: CreateFolderRequest) => {
  const response = await httpFetchClient.post<StatusResponse>("/cloud/folder", JSON.stringify(payload));

  await revalidateCloudResources();
  return response;
};

export const updateResource = async (payload: UpdateResourceRequest) => {
  const { id, ...restPayload } = payload;

  const response = await httpFetchClient.put<StatusResponse>(`/cloud/resource/${id}`, JSON.stringify(restPayload));

  await revalidateCloudResources();
  return response;
};

export const deleteFile = async (fileId: string) => {
  const response = await httpFetchClient.delete<StatusResponse>(`/cloud/file/${fileId}`);

  await revalidateCloudResources();
  return response;
};

export const deleteFolder = async (folderId: string) => {
  const response = await httpFetchClient.delete<StatusResponse>(`/cloud/folder/${folderId}`);

  await revalidateCloudResources();
  return response;
};

export const getExternalStorageLinkStatus = async (): Promise<GetExternalStorageLinkStatus> => {
  return await httpFetchClient.get<GetExternalStorageLinkStatus>("/cloud/storage/link/status");
};

export const linkExternalStorage = async (storage: ECloudStorage) => {
  return await httpFetchClient.post<string>("/cloud/storage/link", undefined, {
    query: {
      storage,
    },
  });
};

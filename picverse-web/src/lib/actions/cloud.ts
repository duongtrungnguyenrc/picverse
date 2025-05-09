"use server";

import { revalidateTag } from "next/cache";
import "server-only";

import { httpFetchClient, objectToFormData } from "../utils";
import { CloudTags } from "../constants";

export const loadResources = async (parentId?: string, pagination?: Pagination): Promise<GetResourcesResponse> => {
  try {
    return await httpFetchClient.get<GetResourcesResponse>("/cloud/resources", {
      next: { revalidate: 5, tags: [CloudTags.RESOURCES] },
      query: {
        parentId,
        ...pagination,
      },
    });
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const revalidateCloudResources = async () => void revalidateTag(CloudTags.RESOURCES);

export const uploadFile = async (payload: UploadFileRequest) => {
  const { parentId, ...restPayload } = payload;

  const response = await httpFetchClient.post<StatusResponse>("/cloud/file", objectToFormData(restPayload), {
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

"use client";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createFolder,
  deleteFile,
  deleteFolder,
  getExternalStorageLinkStatus,
  linkExternalStorage,
  loadResources,
  revalidateCloudResources,
  updateResource,
  uploadFile,
} from "../actions";
import { MutationKeys, QueryKeys } from "../constants";
import { showToastError } from "../utils";

export const useResources = (parentId?: string, firstPageData?: GetResourcesResponse) => {
  return useInfiniteQuery<GetResourcesResponse, AxiosError>({
    queryKey: [QueryKeys.RESOURCES, parentId],
    queryFn: async ({ pageParam }) => {
      if (pageParam === 1 && firstPageData) return firstPageData;
      return await loadResources(parentId, {
        page: Number(pageParam),
        limit: 20,
      });
    },
    initialPageParam: 1,
    initialData: { pages: [firstPageData || { data: [] }], pageParams: [1] },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useUploadFile = () => {
  return useMutation<StatusResponse, Error, UploadFileRequest>({
    mutationFn: uploadFile,
    onSuccess: async (response) => {
      await revalidateCloudResources();
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useCreateFolder = () => {
  return useMutation<StatusResponse, Error, CreateFolderRequest>({
    mutationFn: createFolder,
    onSuccess: async (response) => {
      await revalidateCloudResources();
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useUpdateResource = () => {
  return useMutation<StatusResponse, Error, UpdateResourceRequest>({
    mutationFn: updateResource,
    onSuccess: async (response) => {
      await revalidateCloudResources();
      toast.success(response.message);
    },
    onError: showToastError,
  });
};

export const useDeleteFile = () => {
  return useMutation<StatusResponse, AxiosError, string>({
    mutationKey: [MutationKeys.DELETE_FILE],
    mutationFn: deleteFile,
    onSuccess: async (response) => {
      await revalidateCloudResources();
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useDeleteFolder = () => {
  return useMutation<StatusResponse, AxiosError, string>({
    mutationKey: [MutationKeys.DELETE_FOLDER],
    mutationFn: deleteFolder,
    onSuccess: async (response) => {
      await revalidateCloudResources();
      toast.success(response.message);
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useExternalStorageLinkStatus = () => {
  return useQuery<GetExternalStorageLinkStatus, AxiosError>({
    queryKey: [QueryKeys.EXTERNAL_LINK_STATUS],
    queryFn: getExternalStorageLinkStatus,
  });
};

export const useLinkExternalStorage = () => {
  const router = useRouter();

  return useMutation<string, AxiosError, ECloudStorage>({
    mutationKey: [MutationKeys.LINK_EXTERNAL_STORAGE],
    mutationFn: linkExternalStorage,
    onSuccess: (url) => {
      router.push(url);
    },
    onError: (error) => toast.error(error.message),
  });
};

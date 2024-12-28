"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { httpClient, showAxiosToastError } from "../utils";
import { MutationKeys, QueryKeys } from "../constants";
import { use } from "react";

export const useResources = (parentId?: string) => {
  return useInfiniteQuery<GetResourcesResponse, AxiosError>({
    queryKey: [QueryKeys.RESOURCES, parentId],
    queryFn: async () => {
      const response = await httpClient.get<GetResourcesResponse>(
        `/cloud/resources${parentId ? `?parentId=${parentId}` : ""}`,
      );

      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useUploadFile = (parentId?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, UploadFileRequest>({
    mutationKey: [MutationKeys.UPLOAD_FILE],
    mutationFn: async (payload) => {
      const data: FormData = new FormData();

      Object.entries(payload).forEach(([key, value]) => data.append(key, value));

      const response = await httpClient.post<StatusResponse>(
        `/cloud/file${parentId ? `?parentId=${parentId}` : ""}`,
        data,
      );

      return response.data;
    },
    onSuccess: async (response) => {
      await queryClient.resetQueries({
        predicate: (query) => {
          return query.queryKey.includes(QueryKeys.RESOURCES);
        },
      });
      toast.success(response.message);

      router.refresh();
    },
    onError: showAxiosToastError,
  });
};

export const useCreateFolder = (parentId?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, CreateFolderRequest>({
    mutationKey: [MutationKeys.CREATE_FOLDER],
    mutationFn: async (payload) => {
      const response = await httpClient.post<StatusResponse>("/cloud/folder", { ...payload, parentId });

      return response.data;
    },
    onSuccess: async (response) => {
      await queryClient.resetQueries({
        predicate: (query) => {
          return query.queryKey.includes(QueryKeys.RESOURCES);
        },
      });

      toast.success(response.message);
      router.refresh();
    },
    onError: showAxiosToastError,
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<StatusResponse, AxiosError, UpdateResourceRequest>({
    mutationKey: [MutationKeys.UPDATE_RESOURCE],
    mutationFn: async (data) => {
      const { id, ...payload } = data;

      const response = await httpClient.put<StatusResponse>(`/cloud/resource/${id}`, payload);

      return response.data;
    },
    onSuccess: async (response) => {
      await queryClient.resetQueries({
        predicate: (query) => {
          return query.queryKey.includes(QueryKeys.RESOURCES);
        },
      });

      router.refresh();
      toast.success(response.message);
    },
    onError: showAxiosToastError,
  });
};

export const useDeleteFile = () => {
  return useMutation<StatusResponse, AxiosError, string>({
    mutationKey: [MutationKeys.DELETE_FILE],
    mutationFn: async (fileId) => {
      const response = await toast.promise(httpClient.delete<StatusResponse>(`/cloud/file/${fileId}`), {
        success: "Resource deleted success",
        loading: "Deleting...",
        error: "",
      });

      return response.data;
    },
  });
};

export const useDeleteFolder = () => {
  return useMutation<StatusResponse, AxiosError, string>({
    mutationKey: [MutationKeys.DELETE_FOLDER],
    mutationFn: async (folderId) => {
      const response = await httpClient.delete<StatusResponse>(`/cloud/folder/${folderId}`);

      return response.data;
    },
  });
};

export const useExternalStorageLinkStatus = () => {
  return useQuery<GetExternalStorageLinkStatus, AxiosError>({
    queryKey: [QueryKeys.EXTERNAL_LINK_STATUS],
    queryFn: async () => {
      const response = await httpClient.get<GetExternalStorageLinkStatus>("/cloud/storage/link/status");

      return response.data;
    },
  });
};

export const useLinkExternalStorage = () => {
  const router = useRouter();

  return useMutation<string, AxiosError, ECloudStorage>({
    mutationKey: [MutationKeys.LINK_EXTERNAL_STORAGE],
    mutationFn: async (storage) => {
      const response = await httpClient.post<string>(`/cloud/storage/link?storage=${storage}`);

      return response.data;
    },
    onSuccess: (url) => {
      router.push(url);
    },
    onError: showAxiosToastError,
  });
};

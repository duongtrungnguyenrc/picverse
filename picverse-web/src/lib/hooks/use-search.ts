"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpClient } from "../utils";

export const useTrendingKeywords = () => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.SEARCH_TRENDING],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams({
        limit: String(10),
        page: String(pageParam),
      });

      const response = await httpClient.get<InfiniteResponse<string>>(`/search/trending?${query}`);

      return response.data;
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

export const useSearchHistory = () => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.SEARCH_HISTORY],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams({
        limit: String(10),
        page: String(pageParam),
      });

      const response = await httpClient.get<InfiniteResponse<SearchRecord>>(`/search/history?${query}`);

      return response.data;
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

export const useMutateSearch = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SearchPayload) => {
      return await queryClient.fetchInfiniteQuery<InfiniteResponse<Profile | Pin>>({
        queryKey: [QueryKeys.SEARCH, payload],
        queryFn: async ({ pageParam }) => {
          const query = new URLSearchParams({
            limit: String(10),
            page: String(pageParam),
          });

          const response = await httpClient.post<InfiniteResponse<Profile | Pin>>(`/search/?${query}`, payload);

          return response.data;
        },
        getNextPageParam: (lastPage: InfiniteResponse<Profile | Pin>) => lastPage.nextCursor,
        initialPageParam: 1,
      });
    },
  });

  return mutation;
};

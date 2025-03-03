"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpFetchClient } from "../utils";

export const useTrendingKeywords = () => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.SEARCH_TRENDING],
    queryFn: async ({ pageParam }) => {
      return await httpFetchClient.get<InfiniteResponse<string>>(`/search/trending`, {
        query: {
          limit: 20,
          page: pageParam,
        },
      });
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
      return await httpFetchClient.get<InfiniteResponse<SearchRecord>>(`/search/history`, {
        query: {
          limit: 20,
          page: pageParam,
        },
      });
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
          return await httpFetchClient.post<InfiniteResponse<Profile | Pin>>(`/search/`, JSON.stringify(payload), {
            query: {
              limit: 20,
              page: String(pageParam),
            },
          });
        },
        getNextPageParam: (lastPage: InfiniteResponse<Profile | Pin>) => lastPage.nextCursor,
        initialPageParam: 1,
      });
    },
  });

  return mutation;
};

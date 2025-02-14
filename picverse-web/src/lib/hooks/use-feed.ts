"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpClient } from "../utils";

export const useFeeds = () => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.FEEDS],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams({
        limit: String(50),
        page: String(pageParam),
      });

      const response = await httpClient.get<InfiniteResponse<Pin>>(`/feed?${query}`);

      return response.data;
    },
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

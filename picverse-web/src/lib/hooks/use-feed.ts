"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { loadFeed } from "../actions";

export const useFeeds = (firstPageData?: InfiniteResponse<Pin>) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.FEEDS],
    queryFn: async ({ pageParam }) => await loadFeed({ page: pageParam, limit: 30 }),
    refetchOnWindowFocus: false,
    initialData: {
      pages: [firstPageData || { data: [] }],
      pageParams: [1],
    },
    enabled: !!firstPageData,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 2,
  });
};

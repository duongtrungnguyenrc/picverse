"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createBoard, loadUserBoards } from "../actions";
import { QueryKeys } from "../constants";
import { showToastError } from "../utils";

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: createBoard,
    onError: showToastError,
  });
};

export const useUserBoards = (accountId?: string, firstPageData?: InfiniteResponse<UserBoard>) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.USER_BOARDS, accountId],
    queryFn: async ({ pageParam }) =>
      await loadUserBoards(accountId, {
        page: pageParam,
        limit: 20,
      }),
    initialData: {
      pages: [firstPageData || { data: [] }],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: 1,
  });
};

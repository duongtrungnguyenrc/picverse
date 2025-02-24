"use client";

import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { httpClient, showAxiosToastError } from "../utils";
import { QueryKeys } from "../constants";
import { useContext, useEffect } from "react";
import { PinInteractionContext } from "../contexts";
import { getPinDetail } from "../actions";

export const useCreatePin = () => {
  return useMutation<StatusResponse, AxiosError, CreatePinRequest>({
    mutationFn: async (payload) => {
      const data: FormData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "boolean") {
            data.append(key, value.toString());
          } else if (Array.isArray(value)) {
            value.forEach((tag) => data.append(key, tag));
          } else {
            data.append(key, value);
          }
        }
      });

      const response = await httpClient.post<StatusResponse>("/pin", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onError: showAxiosToastError,
  });
};

export const useSimilarPins = (pinId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.SIMILAR_PINS],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams({
        limit: String(20),
        page: String(pageParam),
      });

      const response = await httpClient.get<InfiniteResponse<Pin>>(`/pin/similar/${pinId}/?${query}`);

      return response.data;
    },
    enabled: !!pinId,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: 1,
  });
};

export const usePinDetail = (pinId: string, prefetchedPin?: PinDetail) => {
  return useQuery({
    queryKey: [QueryKeys.PIN_DETAIL, pinId],
    queryFn: async () => {
      if (prefetchedPin) return prefetchedPin;

      return await getPinDetail(pinId);
    },
  });
};

export const usePinInteraction = () => useContext(PinInteractionContext);

export function usePinComments(pinId: string) {
  const { socket } = usePinInteraction();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !pinId) return;

    socket.emit("listen", pinId);

    socket.on("new-comment", (comment: Cmt) => {
      queryClient.setQueryData([QueryKeys.PIN_COMMENTS, pinId], (oldData: InfiniteData<InfiniteResponse<Cmt>>) => {
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            const isFirstPage = index + 1 === oldData.pageParams[0];

            return {
              ...page,
              data: isFirstPage ? [comment, ...page.data] : page.data,
            };
          }),
        };
      });
    });

    return () => {
      socket.off("new-comment");
    };
  }, [socket, pinId, queryClient]);

  const commentsQuery = useInfiniteQuery({
    queryKey: [QueryKeys.PIN_COMMENTS, pinId],
    queryFn: async () => {
      const response = await httpClient.get<InfiniteResponse<Cmt>>(`/pin/${pinId}/comments`);
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    initialPageParam: 1,
    enabled: !!pinId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: CraeteCommentRequest) => {
      if (!socket) throw new Error("Socket not connected");

      socket.emit("comment", {
        pinId,
        ...content,
      });
    },
  });

  return {
    comments: commentsQuery.data?.pages.flatMap((page) => page.data) || [],
    fetchNextPage: commentsQuery.hasNextPage ? commentsQuery.fetchNextPage : undefined,
    isLoading: commentsQuery.isLoading,
    createComment: createCommentMutation.mutate,
  };
}

export function usePinLikes(pinId: string) {
  const { socket } = usePinInteraction();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !pinId) return;

    socket.on("toggle-like", (isLiked: boolean) => {
      queryClient.setQueryData([QueryKeys.PIN_DETAIL, pinId], (old: PinDetail | undefined) => {
        if (!old) return old;

        return {
          ...old,
          liked: isLiked,
        };
      });
    });

    return () => {
      socket.off("new-like");
    };
  }, [socket, pinId, queryClient]);

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!socket) throw new Error("Socket not connected");

      socket.emit("like", {
        pinId,
      });
    },
  });

  return {
    toggleLike: toggleLikeMutation.mutate,
    isLoading: toggleLikeMutation.isPending,
  };
}

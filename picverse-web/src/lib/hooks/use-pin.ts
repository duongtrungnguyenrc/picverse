"use client";

import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useTransition } from "react";
import toast from "react-hot-toast";

import { getPinDetail, getSimilarPins, getPinComments, revalidateCloudResources } from "../actions";
import { httpFetchClient, objectToFormData } from "../utils";
import { PinInteractionContext } from "../contexts";
import { QueryKeys } from "../constants";

export const usePinInteraction = () => useContext(PinInteractionContext);

async function createPin(payload: CreatePinRequest) {
  const response = await httpFetchClient.post<StatusResponse>("/pin", objectToFormData(payload));
  revalidateCloudResources();

  return response;
}

async function createPinByResource(payload: CreatePinByResourceRequest) {
  const { resourceId, ...restPayload } = payload;

  const response = await httpFetchClient.post<StatusResponse>(`/pin/${resourceId}`, objectToFormData(restPayload));
  revalidateCloudResources();

  return response;
}

export const useCreatePin = () => {
  const [isPending, startTransition] = useTransition();

  const handleCreatePin = (data: CreatePinRequest | CreatePinByResourceRequest, onSuccess: VoidFunction) =>
    startTransition(async () => {
      try {
        const response = await ("resourceId" in data ? createPinByResource(data) : createPin(data));

        toast.success(response.message);
        onSuccess();
      } catch (error) {
        toast.error(String(error));
      }
    });
  return { isPending, handleCreatePin };
};

export const useSimilarPins = (pinId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.SIMILAR_PINS, pinId],
    queryFn: async ({ pageParam }) => await getSimilarPins(pinId, pageParam),
    enabled: !!pinId,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    initialPageParam: 1,
  });
};

export const usePinDetail = (pinId: string, prefetchedPin?: PinDetail) => {
  return useQuery({
    queryKey: [QueryKeys.PIN_DETAIL, pinId],
    queryFn: async () => (await getPinDetail(pinId, false))!,
    initialData: prefetchedPin,
  });
};

export function usePinComments(pinId: string) {
  const { socket } = usePinInteraction();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !pinId) return;

    socket.emit("listen", pinId);

    socket.on("new-comment", (comment: Cmt) => {
      queryClient.setQueryData<InfiniteData<InfiniteResponse<Cmt>>>([QueryKeys.PIN_COMMENTS, pinId], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            const isFirstPage = index === 0;
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
    queryFn: async ({ pageParam }) => await getPinComments(pinId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    initialPageParam: 1,
    enabled: !!pinId,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: CreateCommentRequest) => {
      if (!socket) throw new Error("Socket not connected");

      socket.emit("comment", {
        pinId,
        ...content,
      });
    },
  });

  return {
    comments: commentsQuery.data?.pages.flatMap((page) => page.data) || [],
    fetchNextPage: commentsQuery.fetchNextPage,
    hasNextPage: commentsQuery.hasNextPage,
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

"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { NotificationContext } from "../contexts";
import { httpFetchClient } from "../utils";
import { QueryKeys } from "../constants";
import { useAuth } from "./use-auth";

export const useNotification = (): NotificationContextType => useContext(NotificationContext);

export const useSetNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNotification: Noti) => {
      queryClient.setQueryData<InfiniteResponse<Noti>>([QueryKeys.NOTIFICATIONS], (oldData) => {
        return {
          ...oldData,
          data: [newNotification, ...(oldData?.data || [])],
        };
      });
    },
  });
};

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: [QueryKeys.NOTIFICATIONS],
    queryFn: async ({ pageParam }) => {
      return await httpFetchClient.get<InfiniteResponse<Noti>>(`/social/notifications`, {
        query: {
          limit: String(10),
          page: String(pageParam),
        },
      });
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

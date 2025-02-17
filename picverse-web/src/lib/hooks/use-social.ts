"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryKeys } from "../constants";
import { httpClient } from "../utils";
import { useAuth } from "./use-auth";
import { useContext } from "react";
import { NotificationContext } from "../contexts";

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
  const { account, ready } = useAuth();

  return useInfiniteQuery({
    queryKey: [QueryKeys.NOTIFICATIONS],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams({
        limit: String(10),
        page: String(pageParam),
      });

      const response = await httpClient.get<InfiniteResponse<Noti>>(`/social/notification?s${query}`);

      return response.data;
    },
    enabled: account && ready,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

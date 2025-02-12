"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { ChatContext } from "../contexts";
import { QueryKeys } from "../constants";
import { httpClient } from "../utils";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const useConversations = () => {
  return useQuery({
    queryKey: [QueryKeys.CONVERSATIONS],
    queryFn: async () => {
      const response = await httpClient.get<Array<Conversation>>("/chat/conversations");

      return response.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.MESSAGES, conversationId],
    queryFn: async () => {
      const response = await httpClient.get<InfiniteResponse<Message>>(`/chat/messages/${conversationId}`);

      return response.data;
    },
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { ChatContext } from "../contexts";
import { QueryKeys } from "../constants";
import { httpFetchClient } from "../utils";
import { useAuth } from "./use-auth";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const useConversations = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [QueryKeys.CONVERSATIONS],
    queryFn: async () => {
      return await httpFetchClient.get<Array<Conversation>>("/chat/conversations");
    },
    enabled: isAuthenticated,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.MESSAGES, conversationId],
    queryFn: async () => {
      return await httpFetchClient.get<InfiniteResponse<Message>>(`/chat/messages/${conversationId}`);
    },
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 1,
  });
};

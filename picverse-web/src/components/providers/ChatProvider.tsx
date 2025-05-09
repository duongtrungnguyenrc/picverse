"use client";

import { FC, useEffect, useState, useCallback } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { ChatContext } from "@app/lib/contexts";
import { QueryKeys } from "@app/lib/constants";
import { useSocket } from "@app/lib/hooks";

type ChatProviderProps = { children: React.ReactNode };

const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const [current, setCurrent] = useState<Current>({ isOpen: false, conversation: null });
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket("chat");

  useEffect(() => {
    if (!socket) return;

    socket.on("new-conversation", (conversation: Conversation) => {
      queryClient.setQueryData<Conversation[]>([QueryKeys.CONVERSATIONS], (oldData = []) => [conversation, ...oldData]);
      setCurrent((prev) => prev ?? conversation);
    });

    socket.on("new-current-conversation", (conversation: Conversation) => {
      setCurrent((prev) => {
        return prev ? { ...prev, conversation: { ...(prev.conversation || {}), ...conversation } } : prev;
      });
    });

    socket.on("message", (message: Message) => {
      queryClient.setQueryData<Conversation[]>([QueryKeys.CONVERSATIONS], (oldData = []) =>
        oldData.map((conv) => (conv._id === message.conversationId ? { ...conv, lastMessage: message } : conv)),
      );

      queryClient.setQueryData(
        [QueryKeys.MESSAGES, message.conversationId],
        (oldData: InfiniteData<InfiniteResponse<Message>>) => {
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              const isFirstPage = index + 1 === oldData.pageParams[0];

              return {
                ...page,
                data: isFirstPage ? [...page.data, message] : page.data,
              };
            }),
          };
        },
      );
    });

    socket.on("error", (error: string) => toast.error("Socket error: " + error));

    return () => {
      socket.off("new-conversation");
      socket.off("new-current-conversation");
      socket.off("message");
      socket.off("error");
    };
  }, [socket]);

  const sendMessage = useCallback(
    (payload: SendMessageDto) => {
      socket?.emit("send", payload);
    },
    [socket],
  );

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        current,
        setCurrent,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

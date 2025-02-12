"use client";

import { type FC, useCallback, useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import toast from "react-hot-toast";

import { requestNotificationPermission, showNotification } from "@app/lib/utils";
import { ChatContext } from "@app/lib/contexts";
import { QueryKeys } from "@app/lib/constants";
import { useAuthToken } from "@app/lib/hooks";

type ChatProviderProps = { children: ReactNode };

const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<CurrentConversation>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { token, accountId, ready } = useAuthToken();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    requestNotificationPermission().then(setHasNotificationPermission);
  }, []);

  const initSocket = useCallback(() => {
    if (!token || !accountId || !ready) return;

    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/chat`, {
      transports: ["websocket"],
      auth: { token: `Bearer ${token}` },
    });

    const socket = socketRef.current;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("new-conversation", handleNewConversation);
    socket.on("message", handleNewMessage);

    socket.on("error", (error: string) => {
      toast.error("Socket error: " + error);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, accountId, ready]);

  useEffect(() => {
    const cleanup = initSocket();
    return () => {
      cleanup?.();
    };
  }, [initSocket]);

  const handleNewConversation = useCallback(
    (conversation: Conversation) => {
      queryClient.setQueryData<Array<Conversation>>([QueryKeys.CONVERSATIONS], (oldData) => {
        if (!oldData) return [conversation];
        return [conversation, ...oldData];
      });

      if (!currentConversation || !currentConversation._id) {
        changeCurrentConversation(conversation);
      }

      if (hasNotificationPermission) {
        const sender = conversation.otherMemberProfiles[0];
        showNotification("New Conversation", {
          body: `${sender.firstName} ${sender.lastName} started a conversation`,
          icon: sender.profilePicture,
        });
      }
    },
    [queryClient, hasNotificationPermission],
  );

  const handleNewMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<Array<Conversation>>([QueryKeys.CONVERSATIONS], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((conv) => {
          if (conv._id !== message.conversationId) return conv;

          return {
            ...conv,
            lastMessage: message,
            newNotifications:
              conv._id === currentConversation?._id ? conv.newNotifications : (conv.newNotifications || 0) + 1,
          };
        });
      });

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

      const isSelfMessage = message.senderId === accountId;
      const isCurrentConversation = currentConversation?._id === message.conversationId;

      if (!isSelfMessage && !isCurrentConversation && hasNotificationPermission) {
        showNotification(`New message`, {
          body: message.content,
        });
      }
    },
    [queryClient, accountId, hasNotificationPermission, currentConversation],
  );

  const sendMessage = useCallback((payload: SendMessageDto) => {
    if (!socketRef.current?.connected) {
      console.error("Socket not connected");
      return;
    }
    socketRef.current.emit("send", payload, (response: Message) => {
      console.log("Message sent:", response);
    });
  }, []);

  const changeCurrentConversation = useCallback(
    (conversation: CurrentConversation) => {
      if (conversation) {
        queryClient.setQueryData<Array<Conversation>>([QueryKeys.CONVERSATIONS], (oldData) =>
          oldData?.map((conv) => (conv._id === conversation._id ? { ...conv, newNotifications: 0 } : conv)),
        );
      }
      setCurrentConversation(conversation);
    },
    [queryClient],
  );

  const contextValue = useMemo(
    (): ChatContextType => ({
      isConnected,
      currentConversation,
      sendMessage,
      initSocket,
      changeCurrentConversation,
    }),
    [isConnected, currentConversation, sendMessage, initSocket, changeCurrentConversation],
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export default ChatProvider;

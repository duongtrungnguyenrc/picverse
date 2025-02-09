"use client";

import { type FC, useCallback, useEffect, useRef, useState, useMemo, ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import toast from "react-hot-toast";

import { requestNotificationPermission, showNotification } from "@app/lib/utils";
import { ChatContext } from "@app/lib/contexts";
import { useAuthToken } from "@app/lib/hooks";

type ChatProviderProps = { children: ReactNode };

const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [currentConversation, setConversation] = useState<CurrentConversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { token, accountId, ready } = useAuthToken();
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

    socket.on("conversations", setConversations);

    socket.on("new-conversation", (conversation: Conversation) => {
      setConversations((prev) => [{ ...conversation, newNotifications: 1 }, ...prev]);
      if (hasNotificationPermission) {
        const sender = conversation.otherMemberProfiles[0];
        showNotification("New Conversation", {
          body: `${sender.firstName} ${sender.lastName} started a conversation`,
          icon: sender.profilePicture,
        });
      }
    });

    socket.on("message", handleNewMessage);

    socket.on("error", (error: string) => {
      toast.error("Socket error: " + error);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, accountId, ready, hasNotificationPermission]);

  useEffect(() => {
    const cleanup = initSocket();
    return () => {
      cleanup?.();
    };
  }, [initSocket]);

  const handleNewMessage = useCallback(
    (message: Message) => {
      const isCurrentConversation = message.conversationId === currentConversation?.info._id;
      const isSelfMessage = message.senderId === accountId;

      setMessages((prev) => [...prev, message]);

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id !== message.conversationId) return conv;
          return {
            ...conv,
            lastMessage: message,
            newNotifications:
              !isCurrentConversation && !isSelfMessage ? (conv.newNotifications || 0) + 1 : conv.newNotifications,
          };
        }),
      );

      if (!isSelfMessage && !isCurrentConversation && hasNotificationPermission) {
        const conversation = conversations.find((c) => c._id === message.conversationId);
        const sender = conversation?.otherMemberProfiles[0];
        showNotification(`Message from ${sender?.firstName} ${sender?.lastName}`, {
          body: message.content,
          icon: sender?.profilePicture,
        });
      }
    },
    [currentConversation, accountId, conversations, hasNotificationPermission],
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

  const changeConversation = useCallback((conversation: CurrentConversation | null) => {
    setConversations((prev) =>
      prev.map((conv) => (conv._id === conversation?.info._id ? { ...conv, newNotifications: undefined } : conv)),
    );
    setConversation(conversation);
  }, []);

  const contextValue = useMemo(
    () => ({
      isConnected,
      conversations,
      currentConversation,
      messages,
      sendMessage,
      initSocket,
      changeConversation,
    }),
    [isConnected, conversations, currentConversation, messages, sendMessage, initSocket, changeConversation],
  );

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export default ChatProvider;

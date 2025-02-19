"use client";

import { FC, useEffect, useState, ReactNode, useCallback, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";

import { useAuth, useNotifications, useSetNotifications } from "@app/lib/hooks";
import { NotificationContext } from "@app/lib/contexts";

type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [hasNewNotification, setHasNewNotification] = useState<boolean>(false);
  const { account, ready, accessToken } = useAuth();
  const socketRef = useRef<Socket>();

  const { data: notificationsData, isLoading } = useNotifications();
  const { mutate: addNotification } = useSetNotifications();

  const notifications: Array<Noti> = useMemo(
    () => notificationsData?.pages.flatMap((page) => page.data) || [],
    [notificationsData],
  );

  const initSocket = useCallback(() => {
    if (!accessToken || !account || !ready) return;

    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/social`, {
      transports: ["websocket"],
      auth: { token: `Bearer ${accessToken}` },
    });

    socketRef.current.on("new-comment", (comment: Cmt) => {
      addNotification({
        _id: comment._id,
        type: "comment",
        content: comment.content,
        pinId: comment.pinId,
        createdAt: comment.createdAt,
      });

      setHasNewNotification(true);
    });

    socketRef.current.on("new-like", (like: Like) => {
      addNotification({
        _id: like._id,
        type: "like",
        content: "Someone liked your pin",
        pinId: like.pinId,
        createdAt: like.createdAt,
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [account, ready, accessToken]);

  useEffect(() => {
    const cleanup = initSocket();
    return () => {
      cleanup?.();
    };
  }, [initSocket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        hasNewNotification,
        setHasNewNotification,
        loadingNotification: isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

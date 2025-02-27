"use client";

import { FC, useEffect, useMemo, useState } from "react";

import { useNotifications, useSetNotifications, useSocket } from "@app/lib/hooks";
import { NotificationContext } from "@app/lib/contexts";

type NotificationProviderProps = { children: React.ReactNode };

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const { data: notificationsData, isLoading } = useNotifications();
  const { mutate: addNotification } = useSetNotifications();
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const { socket, isConnected } = useSocket("social");

  const notifications = useMemo(() => notificationsData?.pages.flatMap((page) => page.data) || [], [notificationsData]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new-comment", (comment: Cmt) => {
      addNotification({ ...comment, type: "comment" });
    });

    socket.on("new-like", (like: Like) => {
      addNotification({
        _id: like._id,
        type: "like",
        content: "Someone liked your pin",
        pinId: like.pinId,
        createdAt: like.createdAt,
      });
    });

    return () => {
      socket.off("new-comment");
      socket.off("new-like");
    };
  }, [socket]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        isConnected,
        loadingNotification: isLoading,
        unreadNotifications,
        setUnreadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

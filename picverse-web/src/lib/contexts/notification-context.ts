import { createContext } from "react";

export const NotificationContext = createContext<NotificationContextType>({
  unreadNotifications: 0,
  setUnreadNotifications: function (): void {
    throw new Error("Function not implemented.");
  },
  notifications: [],
  addNotification: function (): void {
    throw new Error("Function not implemented.");
  },
  loadingNotification: false,
  isConnected: false,
});

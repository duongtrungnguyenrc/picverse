import { createContext } from "react";

export const NotificationContext = createContext<NotificationContextType>({
  hasNewNotification: false,
  setHasNewNotification: function (): void {
    throw new Error("Function not implemented.");
  },
  notifications: [],
  addNotification: function (): void {
    throw new Error("Function not implemented.");
  },
  loadingNotification: false,
});

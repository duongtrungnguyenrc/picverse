declare type Noti = BaseModel &
  Pick<TimeStampModel, "createdAt"> & {
    type: "comment" | "like";
    content: string;
    pinId: string;
  };

declare type NotificationContextType = {
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
  notifications: Noti[];
  addNotification: (notification: Noti) => void;
  loadingNotification: boolean;
  isConnected: boolean;
};

declare type Noti = BaseModel &
  Pick<TimeStampModel, "createdAt"> & {
    type: "comment" | "like";
    content: string;
    pinId: string;
  };

declare type NotificationContextType = {
  hasNewNotification: boolean;
  setHasNewNotification: (has: boolean) => void;
  notifications: Noti[];
  addNotification: (notification: Noti) => void;
  loadingNotification: boolean;
};

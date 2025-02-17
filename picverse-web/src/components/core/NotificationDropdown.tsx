"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../shadcn";
import { useNotification } from "@app/lib/hooks";
import { formatTimestamp } from "@app/lib/utils";

type NotificationDropdownProps = {
  children: ReactNode;
};

const NotificationDropdown: FC<NotificationDropdownProps> = ({ children }) => {
  const { loadingNotification, notifications, hasNewNotification, setHasNewNotification } = useNotification();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setHasNewNotification(false);
    }
  }, [open]);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <div className="relative">
          {hasNewNotification && <span className="absolute top-0 right-0 rounded-full w-2 aspect-square bg-red-500" />}

          {children}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[360px] h-[600px] rounded-2xl flex flex-col">
        <div className="p-2 flex items-center justify-between border-b">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex items-center">
            <Button onClick={() => setOpen(false)} variant="ghost" size="icon" className="rounded-full">
              <X className="5-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-2 overflow-y-auto">
          {loadingNotification ? (
            <div className="w-full flex-center flex-col text-xs text-gray-500 animate-pulse">
              <Loader2 className="animate-spin w-3 h-3" />
              Loading notifications
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              return (
                <button
                  key={notification._id}
                  className="flex items-center space-x-3 w-full p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-07%20at%2016.42.36-NdWXa1FBTDWerl6bG5gSc5qSPS1poG.png"
                        }
                      />
                      <AvatarFallback>{notification._id?.[0]}</AvatarFallback>
                    </Avatar>
                    {notification && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{notification.type}</div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-1">
                      <span>{notification.content}</span>
                      <span>·</span>
                      <span>{formatTimestamp(new Date(notification.createdAt))}</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-xs text-center w-full text-gray-500">No notification to present</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;

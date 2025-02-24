"use client";

import { PinInteractionContext } from "@app/lib/contexts";
import { useAuth } from "@app/lib/hooks";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

export function PinInteractionProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/pin-interaction`, {
        transports: ["websocket"],
        auth: {
          token: `Bearer ${accessToken}`,
        },
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [accessToken]);

  return (
    <PinInteractionContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </PinInteractionContext.Provider>
  );
}

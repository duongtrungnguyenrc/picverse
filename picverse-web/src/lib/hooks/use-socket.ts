"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useAuth } from "./use-auth";

export function useSocket(namespace: string) {
  const { accessToken, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/${namespace}`, {
      transports: ["websocket"],
      auth: { token: `Bearer ${accessToken}` },
    });

    socketRef.current.on("connect", () => setIsConnected(true));
    socketRef.current.on("disconnect", () => setIsConnected(false));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [namespace, accessToken, isAuthenticated]);

  return { socket: socketRef.current, isConnected };
}

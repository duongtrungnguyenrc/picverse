"use client";

import { useNetworkStatus } from "@app/lib/hooks";
import { WifiOff } from "lucide-react";
import { useEffect } from "react";

export default function NetworkStatusMonitor() {
  const { isOnline, wasOffline } = useNetworkStatus();

  useEffect(() => {
    if (wasOffline && isOnline) {
      alert("Your network connection has been restored.");
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-md shadow-lg flex items-center gap-2 z-50">
        <WifiOff size={18} />
        <span>You are offline. Please check your network connection.</span>
      </div>
    );
  }

  return null;
}

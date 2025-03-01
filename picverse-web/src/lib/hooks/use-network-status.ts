"use client";

import { useState, useEffect } from "react";

export function useNetworkStatus() {
  const [status, setStatus] = useState({
    wasOffline: false,
    isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (!navigator.onLine) {
      alert("You are currently offline. Please check your network connection.");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status;
}

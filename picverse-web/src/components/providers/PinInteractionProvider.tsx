"use client";

import { PinInteractionContext } from "@app/lib/contexts";
import { useSocket } from "@app/lib/hooks";

export function PinInteractionProvider({ children }: { children: React.ReactNode }) {
  const { socket, isConnected } = useSocket("pin-interaction");

  return (
    <PinInteractionContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </PinInteractionContext.Provider>
  );
}

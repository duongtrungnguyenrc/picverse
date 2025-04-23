"use client";

import { createContext } from "react";

export const PinInteractionContext = createContext<PinInteractionContextType>({
  socket: null,
  isConnected: false,
});

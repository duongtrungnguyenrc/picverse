"use client";

import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signOut: async () => {
    throw new Error("UnImplement method");
  },
});

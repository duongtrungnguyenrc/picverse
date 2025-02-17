"use client";

import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  ready: false,
  authorizeClient: () => {},
  clearAuth: () => {},
});

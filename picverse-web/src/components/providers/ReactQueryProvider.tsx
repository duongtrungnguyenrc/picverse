"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

type ReactQueryProviderProps = {
  children: ReactNode;
};

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ children }) => {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5000,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;

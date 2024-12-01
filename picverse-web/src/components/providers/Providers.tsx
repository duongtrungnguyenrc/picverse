import { ClerkProvider } from "@clerk/nextjs";
import { FC, ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default Provider;

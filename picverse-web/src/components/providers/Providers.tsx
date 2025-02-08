import { FC, ReactNode } from "react";

import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthProvider";
import ChatProvider from "./ChatProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ChatProvider>{children}</ChatProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
};

export default Provider;

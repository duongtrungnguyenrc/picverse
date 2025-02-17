import { FC, ReactNode } from "react";

import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthProvider";
import ChatProvider from "./ChatProvider";
import SocialProvider from "./NotificationProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <SocialProvider>
          <ChatProvider>{children}</ChatProvider>
        </SocialProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
};

export default Provider;

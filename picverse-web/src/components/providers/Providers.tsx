import { FC, ReactNode } from "react";

import ReactQueryProvider from "./ReactQueryProvider";
import SocialProvider from "./NotificationProvider";
import ChatProvider from "./ChatProvider";
import { Authorization } from "../core";
import { PinInteractionProvider } from "./PinInteractionProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <Authorization>
      <ReactQueryProvider>
        <SocialProvider>
          <ChatProvider>
            <PinInteractionProvider>{children}</PinInteractionProvider>
          </ChatProvider>
        </SocialProvider>
      </ReactQueryProvider>
    </Authorization>
  );
};

export default Provider;

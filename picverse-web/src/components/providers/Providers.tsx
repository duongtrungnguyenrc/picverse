import { FC, ReactNode } from "react";

import ReactQueryProvider from "./ReactQueryProvider";
import AuthProvider from "./AuthProvider";

type ProviderProps = {
  children: ReactNode;
};

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
};

export default Provider;

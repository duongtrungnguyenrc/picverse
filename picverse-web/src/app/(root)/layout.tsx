import { FC, ReactNode } from "react";

import { FloatingActionNav, FloatingChat, Header } from "@app/components";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <FloatingActionNav />
      <FloatingChat />
    </>
  );
};

export default MainLayout;

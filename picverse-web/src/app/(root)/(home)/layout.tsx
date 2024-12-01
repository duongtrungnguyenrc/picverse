import { FC, ReactNode } from "react";

import { Footer } from "@app/components";
type HomePageLayouttProps = {
  children: ReactNode;
};

const HomePageLayoutt: FC<HomePageLayouttProps> = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default HomePageLayoutt;

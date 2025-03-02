"use client";

import { FC, ReactElement, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type RequireAuthFeatureProps = {
  children: ReactNode | ((canDisplay: boolean) => ReactNode | ReactElement);
  className?: string;
};

const RequireAuthFeature: FC<RequireAuthFeatureProps> = ({ children, ...props }) => {
  const { isAuthenticated } = useAuth();

  if (typeof children === "function") {
    return <>{children(isAuthenticated)}</>;
  }

  return (
    <div
      className={`${props.className ?? ""} ${isAuthenticated ? "" : "cursor-none pointer-events-none opacity-70"}`}
    >
      {children}
    </div>
  );
};

export default RequireAuthFeature;

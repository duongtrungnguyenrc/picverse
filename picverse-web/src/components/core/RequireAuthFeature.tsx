"use client";

import { FC, ReactNode } from "react";

import { useAuth } from "@app/lib/hooks";

type RequireAuthFeatureProps = {
  children: ReactNode;
} & React.ComponentPropsWithoutRef<"div">;

const RequireAuthFeature: FC<RequireAuthFeatureProps> = ({ children, ...props }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div
      {...props}
      className={`${props.className ?? ""} ${isAuthenticated ? "" : "cursor-none pointer-events-none opacity-70"}`}
    >
      {children}
    </div>
  );
};

export default RequireAuthFeature;

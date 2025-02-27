"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@app/lib/hooks";

type AuthDetectProps = {
  children: ReactNode;
  navigationTo: string;
  isSignedIn: boolean;
};

const AuthDetect: FC<AuthDetectProps> = ({ children, navigationTo, isSignedIn = true }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated !== isSignedIn) {
      router.replace(navigationTo);
    }
  }, [isAuthenticated, isSignedIn, navigationTo, router]);

  return <>{children}</>;
};

export default AuthDetect;

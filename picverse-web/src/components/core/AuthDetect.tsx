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
  const { ready, account } = useAuth();
  const router = useRouter();

  console.log(!!!account === isSignedIn);

  useEffect(() => {
    if (ready && !!!account === isSignedIn) {
      router.replace(navigationTo);
    }
  }, [ready, account]);

  return children;
};

export default AuthDetect;

"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

import loadingAnimation from "@app/assets/lotties/loading.json";
import { useAuth } from "@app/lib/hooks";

type AuthDetectProps = {
  children: ReactNode;
  navigationTo: string;
  isSignedIn: boolean;
};

const AuthDetect: FC<AuthDetectProps> = ({ children, navigationTo, isSignedIn = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { ready, account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready) {
      if (!!!account === isSignedIn) {
        router.replace(navigationTo);
      } else {
        setIsLoading(false);
      }
    }
  }, [ready, account, isSignedIn, navigationTo, router]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Lottie animationData={loadingAnimation} className="w-[150px] h-[150px]" loop />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthDetect;

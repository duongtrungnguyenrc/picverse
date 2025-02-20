"use client";

import { useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";
import Lottie from "lottie-react";

import loadingAnimation from "@app/assets/lotties/loading.json";
import { handleAuthCallback } from "@app/lib/actions";

type CallbackPropsType = {};

const ThirdPartyCallbackPage: FC<CallbackPropsType> = () => {
  const searchParams = useSearchParams();

  const token: string | null = searchParams.get("token");

  useEffect(() => {
    const handle = async () => {
      if (token) {
        await handleAuthCallback(token);
      }
    };

    handle();
  }, [token]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-gray-500">
      <Lottie animationData={loadingAnimation} className="w-[150px] h-[150px]" loop />
    </div>
  );
};

export default ThirdPartyCallbackPage;

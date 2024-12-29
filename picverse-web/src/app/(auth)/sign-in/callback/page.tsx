"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Lottie from "lottie-react";
import jwt from "jsonwebtoken";

import { useAuth, useClientSecret, useGoogleSignIn } from "@app/lib/hooks";
import loadingAnimation from "@app/assets/lotties/loading.json";
import { setAuthCookie } from "@app/lib/actions";
import { Button } from "@app/components";

type CallbackPropsType = {};

const ThirdPartyCallbackPage: FC<CallbackPropsType> = () => {
  const { mutate: googleSignIn } = useGoogleSignIn();
  const { data: secret } = useClientSecret();
  const searchParams = useSearchParams();
  const { authorizeClient } = useAuth();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const token: string | null = searchParams.get("token");

  useEffect(() => {
    const handle = async () => {
      if (token && secret) {
        try {
          const decodedToken = jwt.verify(token, secret);

          const { secret: decodedSecret, ...tokenPair }: ThirdPartyTokenPayload =
            decodedToken as ThirdPartyTokenPayload;

          if (tokenPair) {
            await setAuthCookie(tokenPair);
            authorizeClient();
            return;
          }
        } catch (error) {
          setErrorMessage((error as Error).message || "Error when sign in with third party");
        }
      }
    };

    handle();
  }, [token, secret, router, authorizeClient]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-gray-500">
      {errorMessage ? (
        <>
          <p className="text-lg font-semibold">Authentication failed...</p>
          <p className="text-sm">{errorMessage}</p>

          <Button className="mt-2 text-sm font-semibold" onClick={() => googleSignIn()}>
            Try again
          </Button>
        </>
      ) : (
        <Lottie animationData={loadingAnimation} className="w-[150px] h-[150px]" loop />
      )}
    </div>
  );
};

export default ThirdPartyCallbackPage;

"use client";

import { useContext, useEffect, useState, useTransition } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

import {
  getAuthCookie,
  getClientSecret,
  googleSignIn,
  refreshToken,
  signIn,
  signOut,
  twoFactorSignIn,
} from "../actions";
import { ACCESS_TOKEN_PREFIX, MutationKeys, QueryKeys } from "../constants";
import { httpFetchClient, showToastError } from "../utils";
import { AuthContext } from "../contexts";

export const useAuth = () => useContext(AuthContext);

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000;
const TOKEN_THRESHOLD = 5 * 60 * 1000;

export const useAuthCheck = () => {
  useEffect(() => {
    const checkToken = async () => {
      const accessToken = await getAuthCookie(ACCESS_TOKEN_PREFIX);

      if (!accessToken) {
        await refreshToken();
        return;
      }

      const decoded: { exp: number } = jwtDecode(accessToken);
      const expiresAt = new Date(decoded.exp * 1000).getTime();
      const now = Date.now();

      if (expiresAt - now < TOKEN_THRESHOLD) {
        refreshToken();
      }
    };

    checkToken();

    const interval = setInterval(checkToken, TOKEN_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);
};

export const useSignIn = (redirect?: boolean) => {
  const [credential, set2FACredential] = useState<Require2FAResponse | undefined>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignIn = (data: SignInRequest) => {
    startTransition(async () => {
      try {
        const response = await signIn(data);

        if (response) {
          set2FACredential(response);
          console.log("2FA required, credential set:", response);
          return;
        }

        if (redirect) {
          router.back();
        }

        toast.success("Sign in success");
      } catch (error) {
        toast.error("Sign in failed: " + error);
      }
    });
  };

  const handleVerify2FA = (otpCode: string) => {
    if (!credential) {
      toast.error("Invalid 2FA credential");
      return;
    }

    startTransition(async () => {
      try {
        await twoFactorSignIn({
          ...credential,
          otpCode,
        });

        set2FACredential(undefined);

        if (redirect) {
          router.back();
        }

        toast.success("Sign in success");
      } catch (error) {
        toast.error("2FA verification failed: " + error);
      }
    });
  };

  return {
    handleSignIn,
    handleVerify2FA,
    isPending,
    credential,
    set2FACredential,
  };
};

export const useGoogleSignIn = () => {
  const mutationResult = useMutation<void, Error>({
    mutationKey: [MutationKeys.GOOGLE_SIGN_IN],
    mutationFn: async () => {
      const secret = await getClientSecret();
      await googleSignIn(secret);
    },
  });

  return {
    ...mutationResult,
  };
};

export const useSignOut = () => {
  return useMutation<void, Error>({
    mutationKey: [MutationKeys.SIGN_OUT],
    mutationFn: signOut,
    onSuccess: async () => {
      toast.success("Sign out success");
    },
    onError: showToastError,
  });
};

export const useEnable2FA = () => {
  return useMutation<string, Error>({
    mutationFn: async () => {
      return await httpFetchClient.post<string>("/auth/2fa/enable");
    },
    onError: showToastError,
  });
};

export const useDisable2FA = () => {
  return useMutation<StatusResponse, Error, Disable2FARequest>({
    mutationFn: async (data) => {
      return await httpFetchClient.post<StatusResponse>("/auth/2fa/disable", JSON.stringify(data));
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: showToastError,
  });
};

export const useVerify2FA = () => {
  return useMutation<StatusResponse, Error, Verify2FARequest>({
    mutationFn: async (data) => {
      return await httpFetchClient.post("/auth/2fa/verify", JSON.stringify(data));
    },
    onError: showToastError,
  });
};

export const useClientSecret = () =>
  useQuery<string>({
    queryKey: [QueryKeys.CLIENT_SECRET],
    queryFn: async () => await getClientSecret(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
  });

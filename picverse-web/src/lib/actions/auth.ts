"use server";

import "server-only";

import { revalidateTag } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { generate } from "randomstring";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { clearAuthCookie, getAuthCookie, setAuthCookie } from "./cookies";
import { httpFetchClient } from "../utils";
import { AuthTags, BASE_URL, REFRESH_TOKEN_PREFIX } from "../constants";

export const auth = async (): Promise<Auth> => {
  try {
    const [account, tokenPair] = await Promise.all([
      httpFetchClient.get<BaseModel>("/auth", {
        next: {
          tags: [AuthTags.AUTH],
          revalidate: 60 * 60, // 1 hours in minutes
        },
      }),
      getTokens(),
    ]);

    return {
      account,
      ...tokenPair,
    };
  } catch (error) {
    return {};
  }
};

export const getTokens = async (): Promise<Partial<TokenPair>> => {
  const [accessToken, refreshToken] = await Promise.all([
    getAuthCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX),
    getAuthCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX),
  ]);

  return { accessToken, refreshToken };
};

export const revalidateAuth = async () => {
  void revalidateTag(AuthTags.AUTH);
};

export const refreshToken = async (): Promise<string> => {
  try {
    const refreshToken: string | undefined = await getAuthCookie(REFRESH_TOKEN_PREFIX);

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      await clearAuthCookie();
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    await setAuthCookie(data);

    return data;
  } catch (error) {
    throw error;
  } finally {
    revalidateAuth();
  }
};

export const signIn = async (payload: SignInRequest): Promise<Require2FAResponse | undefined> => {
  const response = await httpFetchClient.post<TokenPair | Require2FAResponse>(
    "/auth/sign-in",
    JSON.stringify(payload),
    {
      retry: false,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!("require2FA" in response)) {
    await setAuthCookie(response);
    revalidateAuth();
    return;
  }

  return response;
};

export const twoFactorSignIn = async (payload: SignInWithTwoFactorRequest) => {
  const response = await httpFetchClient.post<TokenPair>("/auth/sign-in/2fa", JSON.stringify(payload));

  await setAuthCookie(response);
  revalidateAuth();
  redirect("/", RedirectType.replace);
};

export const signOut = async () => {
  await httpFetchClient.post("/auth/sign-out");

  await clearAuthCookie();
  revalidateAuth();
};

export const googleSignIn = async (secret: string) => {
  redirect(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/auth/oauth?platform=google&secret=${secret}`);
};

export const getClientSecret = async () => {
  const cookieStore = await cookies();

  let secret = cookieStore.get("ast")?.value;

  if (!secret) {
    secret = generate({ length: 32 }) + Date.now().toString();
    cookieStore.set({
      name: "ast",
      value: secret,
    });
  }

  return secret;
};

export async function handleAuthCallback(token: string) {
  const secret = await getClientSecret();
  const decodedToken = jwt.verify(token, secret) as ThirdPartyTokenPayload;
  const { secret: decodedSecret, ...tokenPair } = decodedToken;

  await setAuthCookie(tokenPair);
  revalidateAuth();
  void redirect("/");
}

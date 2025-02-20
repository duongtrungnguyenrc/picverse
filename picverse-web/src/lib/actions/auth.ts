"use server";

import "server-only";
import { cookies } from "next/headers";
import { httpClient } from "../utils";
import { generate } from "randomstring";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { setAuthCookie } from "./cookies";

export const loadAuthAccount = async (accessToken?: string): Promise<Account | undefined> => {
  try {
    const response = await httpClient.get<Account>("/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    return undefined;
  }
};

export const googleSignIn = async (secret: string) => {
  redirect(`${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/auth/oauth?platform=google&secret=${secret}`);
};

export const getClientSecret = async () => {
  const cookieStore = await cookies();

  let secret = cookieStore.get("authSecret")?.value;

  if (!secret) {
    secret = generate({ length: 32 }) + Date.now().toString();
    cookieStore.set({
      name: "authSecret",
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

  console.debug("valid secret");

  redirect("/");
}

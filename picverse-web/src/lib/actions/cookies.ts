"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { decrypt, encrypt } from "@app/lib/utils";

export async function getCookie(key?: string): Promise<string | undefined> {
  const cookieStore = await cookies();

  if (key) {
    const cookieEntry = cookieStore.get(key);

    if (!cookieEntry || !cookieEntry.value) return;

    return decrypt(cookieEntry.value);
  }

  return cookieStore.toString();
}

export async function setAuthCookie(tokenPair: Partial<TokenPair>) {
  const pair = {
    [process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX]: tokenPair.accessToken,
    [process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX]: tokenPair.refreshToken,
  };

  const cookieStore = await cookies();

  Object.entries(pair).forEach(([key, value]) => {
    if (value) {
      const encryptedToken = encrypt(value);

      cookieStore.set({
        name: key,
        value: encryptedToken,
        secure: true,
        httpOnly: true,
        expires: new Date(jwtDecode(value).exp! * 1000),
      });
    }
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX);
  cookieStore.delete(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX);
}

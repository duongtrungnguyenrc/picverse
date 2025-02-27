import { getAuthCookie } from "@app/lib/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const [accessToken, refreshToken] = await Promise.all([
    getAuthCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_PREFIX),
    getAuthCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_PREFIX),
  ]);

  return NextResponse.json({
    accessToken,
    refreshToken,
  });
}

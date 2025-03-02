import { httpFetchClient } from "@app/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "File not found" }, { status: 404 });
  }

  try {
    const response: Response = await httpFetchClient.get(`/cloud/file/${id}`, { rawResponse: true });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to load image" }, { status: response.status });
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=360",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: response.status },
      );
    }

    const blob = await response.blob();
    const headers = new Headers();

    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") ?? "application/octet-stream",
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="${url.split("/").pop()}"`,
    );

    return new NextResponse(blob, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}

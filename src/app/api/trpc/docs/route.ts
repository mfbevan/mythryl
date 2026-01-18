import { NextResponse } from "next/server";
import { renderTrpcPanel } from "trpc-ui";

import { appRouter } from "~/server/api/root";

export function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: `/api/trpc`,
      transformer: "superjson",
      meta: {
        title: "Mythryl API",
        description: "Mythryl API",
      },
    }),
    {
      status: 200,
      headers: [["Content-Type", "text/html"] as [string, string]],
    },
  );
}

import { NextResponse } from "next/server";
import { renderTrpcPanel } from "trpc-ui";

import { env } from "~/env.app";
import { workerRouter } from "~/server/worker/router/_router";

export function GET() {
  if (env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(
    renderTrpcPanel(workerRouter, {
      url: `/api/worker`,
      transformer: "superjson",
      meta: {
        title: "Immutagen Worker API",
        description: "Immutagen Worker API",
      },
    }),
    {
      status: 200,
      headers: [["Content-Type", "text/html"] as [string, string]],
    },
  );
}

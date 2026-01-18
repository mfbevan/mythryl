import { type NextRequest, NextResponse } from "next/server";

import { validateWorkerRequest } from "~/server/worker/payload";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  console.log("Worker Request Received");

  try {
    const payload = await validateWorkerRequest(request);
    console.log("Worker Payload", payload);

    switch (payload.type) {
      default:
        throw new Error(`Unknown worker type`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Worker failed", error);
    return NextResponse.json(
      { error: "Worker failed", details: error },
      { status: 500 },
    );
  }
}

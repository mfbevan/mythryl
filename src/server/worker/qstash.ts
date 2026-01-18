import { Client, Receiver } from "@upstash/qstash";
import type { NextRequest } from "next/server";

import type { WorkerPayload } from "./payload";

import { env } from "~/env.app";

export const client = new Client({
  token: env.QSTASH_TOKEN,
});

export const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export const createCallbackUrl = (path = "") => {
  const url = new URL(path, "https://immutagen.ai/api/worker");
  return url.toString();
};

export const validateQstashRequest = async (
  request: NextRequest,
): Promise<WorkerPayload> => {
  const signature = request.headers.get("upstash-signature");
  if (!signature || typeof signature !== "string") {
    throw new Error("Missing upstash signature");
  }

  const body = await request.json();
  const verified = await receiver.verify({
    signature,
    body: JSON.stringify(body),
  });

  if (!verified) {
    throw new Error("Invalid upstash signature");
  }

  return body;
};

export const isQstashRequest = (request: NextRequest) => {
  const signature = request.headers.get("upstash-signature");

  return signature && typeof signature === "string" && signature.length > 0;
};

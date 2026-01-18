import type { NextRequest } from "next/server";

import { isQstashRequest, validateQstashRequest } from "./qstash";

export type TestPayload = {
  type: "test";
  input: {};
};

export type WorkerPayload = TestPayload;

export const validateWorkerRequest = async (
  request: NextRequest,
): Promise<WorkerPayload> => {
  if (isQstashRequest(request)) {
    return validateQstashRequest(request);
  }

  throw new Error("Invalid request");
};

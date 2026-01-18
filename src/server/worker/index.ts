import { cache } from "react";

import { workerRouter } from "./router/_router";
import { createWorkerCallerFactory } from "./worker";

import { db } from "~/server/db";

const createWorkerContext = cache(async () => {
  return { db };
});
export type WorkerContext = Awaited<ReturnType<typeof createWorkerContext>>;

export const createWorkerCaller = createWorkerCallerFactory(workerRouter);
export const worker = createWorkerCaller(createWorkerContext);

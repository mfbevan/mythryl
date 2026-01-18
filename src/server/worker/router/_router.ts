import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createWorkerRouter } from "../worker";

export const workerRouter = createWorkerRouter({});
export type WorkerRouter = typeof workerRouter;

export type WorkerInputs = inferRouterInputs<typeof workerRouter>;
export type WorkerOutputs = inferRouterOutputs<typeof workerRouter>;

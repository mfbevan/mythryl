// @ts-expect-error - This is a workaround to allow BigInts to be serialized to JSON
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

import { initTRPC } from "@trpc/server";
import { headers } from "next/headers";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";

export const createWorkerTRPCContext = async (opts: { req?: Request }) => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "server");
  return { db, ...opts };
};

export type WorkerContext = Awaited<ReturnType<typeof createWorkerTRPCContext>>;

const g = initTRPC.context<typeof createWorkerTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createWorkerRouter = g.router;
export const createWorkerCallerFactory = g.createCallerFactory;

export const workerProcedure = g.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: { ...ctx },
  });
});

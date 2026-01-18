import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env.app";
import { createWorkerTRPCContext } from "~/server/worker/worker";
import { workerRouter } from "~/server/worker/router/_router";

const createContext = async (req: NextRequest) => {
  return createWorkerTRPCContext({
    req,
  });
};

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/worker",
    req,
    router: workerRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };

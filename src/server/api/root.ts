import { aspenRouter } from "@/server/api/routers/aspenRouter";
import { createTRPCRouter } from "@/server/api/trpc";
import { sageRouter } from "./routers/sageRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  aspenOrder: aspenRouter,
  sageOrder: sageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

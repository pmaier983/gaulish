import { createTRPCRouter } from "~/server/api/trpc"
import { generalRouter } from "~/server/api/routers/general"
import { mapRouter } from "~/server/api/routers/map"
import { shipsRouter } from "~/server/api/routers/ships"
import { logsRouter } from "~/server/api/routers/logs"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  general: generalRouter,
  map: mapRouter,
  ships: shipsRouter,
  logs: logsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

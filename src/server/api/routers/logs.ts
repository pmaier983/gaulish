import { desc, eq, sql } from "drizzle-orm"
import { log } from "schema"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const logsRouter = createTRPCRouter({
  /**
   * Fetch a users Logs Paginated!
   */
  getLogs: protectedProcedure
    .input(
      // https://trpc.io/docs/client/react/useInfiniteQuery
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(
      async ({
        ctx,
        input: { cursor: possibleCursor, limit: possibleLimit },
      }) => {
        // TODO: is this the proper way to set a default?
        const limit = possibleLimit ?? 50
        const cursor = possibleCursor ?? 0

        const logs = await ctx.db.query.log.findMany({
          limit,
          where: eq(log.userId, ctx.session.user.id),
          orderBy: [desc(log.createdAt)],
          // TODO: this doesn't work if logs are added in-between requests?
          offset: cursor,
        })

        // This fetches the number of logs the user has
        const logsCount = parseInt(
          (
            await ctx.db
              .select({ count: sql<string>`count(*)` })
              .from(log)
              .where(eq(log.userId, ctx.session.user.id))
          ).at(0)?.count ?? "0",
          10,
        )

        return {
          logs,
          // the next cursor should be undefined if there are no more logs to render
          nextCursor: cursor + limit >= logsCount ? undefined : cursor + limit,
        }
      },
    ),
})

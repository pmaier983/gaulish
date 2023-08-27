import { inArray } from "drizzle-orm"
import { path, tile, users, ship, city, npc } from "schema"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc"
import { ADMINS } from "~/server/auth"
import {
  DEFAULT_CITIES,
  DEFAULT_MAP,
  DEFAULT_NPCS,
  DEFAULT_PATHS,
} from "~/server/defaults"

// TODO: use relational queries for things?
export const generalRouter = createTRPCRouter({
  isUserAdmin: protectedProcedure.query(({ ctx }) => {
    return ADMINS.includes(ctx.session.user.email ?? "")
  }),
  setupDefaultGamestate: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.db.transaction(async (trx) => {
      await trx.insert(tile).values(DEFAULT_MAP)
      await trx.insert(npc).values(DEFAULT_NPCS)
      await trx.insert(path).values(DEFAULT_PATHS)
      await trx.insert(city).values(DEFAULT_CITIES)
    })
  }),
  /**
   * Given a list of emails, return a sorted leaderboard of {usernames, gold}
   */
  getLeaderboard: protectedProcedure
    .input(z.string().array())
    .query(async ({ ctx, input }) => {
      const leaderboardUsers = await ctx.db
        .select({
          userId: users.id,
          email: users.email,
          username: users.username,
        })
        .from(users)
        .where(inArray(users.email, input))

      const userIdToUsername = leaderboardUsers.reduce<{
        [key: string]: string
      }>((acc, cur) => {
        acc[cur.userId] = cur.username
        return acc
      }, {})

      const usersShips = await ctx.db
        .select({ userId: ship.userId, gold: ship.gold })
        .from(ship)
        .where(
          inArray(
            ship.userId,
            leaderboardUsers.map((user) => user.userId),
          ),
        )

      const userIdToGold = usersShips.reduce<{ [key: string]: number }>(
        (acc, cur) => {
          if (acc[cur.userId]) {
            acc[cur.userId] += cur.gold
          } else {
            acc[cur.userId] = cur.gold
          }
          return acc
        },
        {},
      )

      return Object.entries(userIdToGold).map(([userId, gold]) => ({
        username: userIdToUsername[userId],
        gold: gold,
      }))
    }),
})

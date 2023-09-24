import { inArray } from "drizzle-orm"
import { users, ship } from "schema"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { ADMINS } from "~/server/auth"

// TODO: use relational queries for things?
export const generalRouter = createTRPCRouter({
  isUserAdmin: protectedProcedure.query(({ ctx }) => {
    return ADMINS.includes(ctx.session.user.email ?? "")
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

      const usersShips = await ctx.db.query.ship.findMany({
        where: inArray(
          ship.userId,
          leaderboardUsers.map((user) => user.userId),
        ),
        with: {
          cargo: {
            columns: {
              gold: true,
            },
          },
        },
        columns: {
          userId: true,
        },
      })

      const userIdToGold = usersShips.reduce<{ [key: string]: number }>(
        (acc, cur) => {
          if (acc[cur.userId]) {
            acc[cur.userId] += cur.cargo.gold
          } else {
            acc[cur.userId] = cur.cargo.gold
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

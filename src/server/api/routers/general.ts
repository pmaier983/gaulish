import { eq, inArray } from "drizzle-orm"
import { type Npc, type Path, npc, path, tile, users } from "schema"
import {
  SHIP_ID_TO_SHIP_TYPES,
  TILE_TYPES,
  TILE_TYPE_TO_TYPE_ID,
} from "~/components/constants"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc"
import { ADMINS } from "~/server/auth"
import { getPathFromString } from "~/utils/utils"

// TODO - add all the following api paths:
// - getMap
// - setMap (admin only)
// - getUserStats
// - getUserShips
// - getNpcPaths
// - getUserShipPaths
//   - update this list constantly with websockets.

export const generalRouter = createTRPCRouter({
  // TODO: implement map rendering on the client
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tile)
  }),
  isUserAdmin: protectedProcedure.query(({ ctx }) => {
    return ADMINS.includes(ctx.session.user.email ?? "")
  }),
  setTile: adminProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(tile).values({
      id: 2,
      x: 1,
      y: 1,
      type_id: TILE_TYPE_TO_TYPE_ID[TILE_TYPES.OCEAN],
    })
  }),
  /**
   * Given a list of emails, return a sorted leaderboard of {usernames, gold}
   *
   * @param {Array<string>} input - An array of email addresses of users to retrieve from the leaderboard.
   * @returns {Promise<Array<{ username: string, gold: number }>>} - A Promise that resolves to an array of objects containing the username and gold points of the users in descending order based on their gold points.
   */
  getLeaderboard: protectedProcedure
    .input(z.string().array())
    .query(async ({ ctx, input }) => {
      const leaderboardUsers = await ctx.db
        .select()
        .from(users)
        .where(inArray(users.email, input))
      return leaderboardUsers
        .sort((a, b) => b.gold - a.gold)
        .map((user) => ({
          username: user.username,
          gold: user.gold,
        }))
    }),
  getNpcs: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(npc)
      .leftJoin(path, eq(path.id, npc.pathId))
      .then((npcs) =>
        npcs
          .filter(
            // Type Guards (https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
            (npcAndPath): npcAndPath is { npc: Npc; path: Path } =>
              !!npcAndPath.path && !!npcAndPath.npc,
          )
          .map(({ npc, path }) => {
            const ship = SHIP_ID_TO_SHIP_TYPES[npc.shipTypeId]
            if (!ship)
              throw new Error(`Invalid shipTypeId, ${JSON.stringify(npc)}`)
            return {
              ...npc,
              path: {
                ...path,
                path: getPathFromString(path.path),
              },
              ship,
            }
          }),
      )
  }),
})

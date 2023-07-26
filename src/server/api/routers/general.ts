import { eq, inArray } from "drizzle-orm"
import { type Npc, type Path, npc, path, tile, users, ship } from "schema"
import { z } from "zod"
import { type PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import {
  SHIP_ID_TO_SHIP_TYPES,
  TILE_TYPES,
  TILE_TYPE_TO_TYPE_ID,
} from "~/components/constants"
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

interface GetUserFromEmail {
  email?: string | null
  db: PlanetScaleDatabase<Record<string, never>>
}

// TODO: add user id to the session!!!!
const getUserFromEmail = async ({ email, db }: GetUserFromEmail) => {
  if (!email) throw new Error("No user email found in session")
  // TODO: how to get userId in the users session?
  const user = (
    await db.select().from(users).where(eq(users.email, email)).limit(1)
  ).at(0)
  if (!user) throw new Error("No user found with that email")
  return user
}

export const generalRouter = createTRPCRouter({
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
   * Adds a ship to a users profile
   */
  addShip: protectedProcedure
    .input(
      z.object({
        ship_type_id: z.number(),
        city_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getUserFromEmail({
        email: ctx.session.user.email,
        db: ctx.db,
      })

      return ctx.db.insert(ship).values({
        shipTypeId: input.ship_type_id,
        userId: user.id,
        cityId: input.city_id,
        cargo: {},
      })
    }),
  /**
   * Fetch a list of the users Ships
   */
  getUsersShips: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserFromEmail({
      email: ctx.session.user.email,
      db: ctx.db,
    })
    return ctx.db.select().from(ship).where(eq(ship.userId, user.id))
  }),
  /**
   * Given a list of emails, return a sorted leaderboard of {usernames, gold}
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
  /**
   * Fetch a list of NPCs with their ships & paths attached
   */
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

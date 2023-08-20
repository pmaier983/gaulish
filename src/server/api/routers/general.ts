import { eq, inArray } from "drizzle-orm"
import { type Npc, type Path, npc, path, tile, users, ship, city } from "schema"
import { z } from "zod"
import { type PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
import { createId } from "@paralleldrive/cuid2"

import { SHIP_ID_TO_SHIP_TYPES } from "~/components/constants"
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
  /**
   * Let a user sail their ship
   */
  sail: protectedProcedure
    .input(
      z.object({
        shipId: z.number(),
        path: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { path: shipPath, shipId } = input
      return await ctx.db.transaction(async (trx) => {
        const userShip = (
          await trx.select().from(ship).where(eq(ship.id, shipId)).limit(1)
        ).at(0)

        if (!userShip) throw new Error("No ship found with that id")

        // TODO: do some path validation?
        // TODO: check for enemy interceptions

        const lastTile = shipPath.at(-1)

        if (!lastTile) throw new Error("No last tile found in path")

        const destination = (
          await trx
            .select()
            .from(city)
            .where(eq(city.xyTileId, lastTile))
            .limit(1)
        ).at(0)

        // TODO: send this to the users log book || chat?
        if (!destination) throw new Error("Ship is not sailing to a city")

        const destinationCity = destination

        const newPath = {
          pathArray: shipPath,
          createdAt: new Date(),
          id: createId(),
        }

        // Add the path to the path list
        await trx.insert(path).values(newPath)

        // Update the ships location (prematurely)
        await trx
          .update(ship)
          .set({ cityId: destinationCity.id })
          .where(eq(ship.id, shipId))

        return { path: newPath, ship: userShip }
      })
    }),
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tile)
  }),
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
   * Fetch a list of all the cities
   */
  getCities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(city)
  }),
  /**
   * Adds a ship to a users profile
   */
  addShip: protectedProcedure
    .input(
      z.object({
        ship_type_id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        const cities = await trx.select().from(city).limit(1)

        const cityForNewShip = cities.at(0)

        if (!cityForNewShip) throw Error("No cities found for the new ship")

        const user = await getUserFromEmail({
          email: ctx.session.user.email,
          db: trx,
        })

        return trx.insert(ship).values({
          shipTypeId: input.ship_type_id,
          userId: user.id,
          cityId: cityForNewShip.id,
        })
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
              path,
              ship,
            }
          }),
      )
  }),
})

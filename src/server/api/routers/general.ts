import { asc, eq, inArray, sql } from "drizzle-orm"
import {
  path,
  tile,
  users,
  ship,
  city,
  npc,
  log,
  type Npc,
  type Path,
} from "schema"
import { z } from "zod"
import { createId } from "@paralleldrive/cuid2"

import { SHIP_TYPE_TO_SHIP_PROPERTIES } from "~/components/constants"
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
  /**
   * Let a user sail their ship
   */
  sail: protectedProcedure
    .input(
      z.object({
        shipId: z.string(),
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
   * Fetch a users Logs
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
          orderBy: [asc(log.createdAt), asc(log.id)],
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
  addLog: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(log).values({
      text: input,
      userId: ctx.session.user.id,
    })
  }),
  /**
   * Adds a ship to a users profile
   */
  addShip: protectedProcedure
    .input(
      z.object({
        ship_type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (trx) => {
        const cities = await trx.select().from(city).limit(1)

        // TODO: properly choose a city!
        const cityForNewShip = cities.at(0)

        if (!cityForNewShip) throw Error("No cities found for the new ship")

        const shipProperties = SHIP_TYPE_TO_SHIP_PROPERTIES[input.ship_type]

        if (!shipProperties)
          throw Error("No ship properties found for that ship_type")

        const partialNewShip = {
          id: createId(),
          userId: ctx.session.user.id,
          cityId: cityForNewShip.id,
          ...shipProperties,
          name: "shippy mcshipface",
        }

        await trx.insert(ship).values(partialNewShip)

        const newShip = (
          await trx
            .select()
            .from(ship)
            .where(eq(ship.id, partialNewShip.id))
            .limit(1)
        ).at(0)

        if (!newShip)
          throw new Error("Ship was not found immediately after being inserted")

        return newShip
      })
    }),
  /**
   * Fetch a list of the users Ships
   */
  getUsersShips: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(ship)
      .where(eq(ship.userId, ctx.session.user.id))
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
        npcs.filter(
          // Type Guards (https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
          (npcAndPath): npcAndPath is { npc: Npc; path: Path } =>
            !!npcAndPath.path && !!npcAndPath.npc,
        ),
      )
  }),
})

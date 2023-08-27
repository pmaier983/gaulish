import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { city, path, ship } from "schema"
import { z } from "zod"
import { SHIP_TYPE_TO_SHIP_PROPERTIES } from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const shipsRouter = createTRPCRouter({
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
})

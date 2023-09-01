import { createId } from "@paralleldrive/cuid2"
import { and, eq, inArray } from "drizzle-orm"
import { city, path, ship, tile } from "schema"
import { z } from "zod"
import { SHIP_TYPE_TO_SHIP_PROPERTIES } from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  type ValidationProps,
  getEnhancedShipPath,
  getTileObject,
  validateTileConflicts,
} from "~/utils/sailingUtils"

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
        const startTime = new Date()
        const newPath = {
          pathArray: shipPath,
          createdAt: startTime,
          id: createId(),
        }

        const userShip = await trx.query.ship.findFirst({
          where: eq(ship.id, shipId),
        })

        if (!userShip) throw new Error("No ship found with that id")

        const tiles = await trx.query.tile.findMany({
          where: inArray(tile.xyTileId, shipPath),
        })

        const events: ValidationProps["events"] = []

        const validationProps: ValidationProps = {
          tiles,
          shipPath,
          userShip: userShip,

          events,
          startTime,

          db: trx,
          userId: ctx.session.user.id,

          tilesObject: getTileObject(tiles),
          enhancedShipPath: getEnhancedShipPath(shipPath, startTime, userShip),
        }

        // Validate if the ship hits land
        await validateTileConflicts(validationProps)

        // TODO: do some path validation?

        // TODO: check if the ship is already sailing

        // TODO: check for enemy interceptions

        const lastTile = shipPath.at(-1)

        if (!lastTile) throw new Error("No last tile found in path")

        const destination = await trx.query.city.findFirst({
          where: eq(city.xyTileId, lastTile),
        })

        // TODO: send this to the users log book || chat?
        if (!destination) throw new Error("Ship is not sailing to a city")

        const destinationCity = destination

        // Add the path to the path list
        await trx.insert(path).values(newPath)

        // Update the ships location (prematurely)
        await trx
          .update(ship)
          .set({ cityId: destinationCity.id })
          .where(eq(ship.id, shipId))

        return {
          path: newPath,
          ship: userShip,
          events,
        }
      })
    }),
  /**
   * Fetch a list of the users Ships
   */
  getUsersShips: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.ship.findMany({
      where: and(eq(ship.userId, ctx.session.user.id), eq(ship.isSunk, false)),
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
        // TODO: properly choose a city!
        const cityForNewShip = await trx.query.city.findFirst()

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

        const newShip = await trx.query.ship.findFirst({
          where: eq(ship.id, partialNewShip.id),
        })

        if (!newShip)
          throw new Error("Ship was not found immediately after being inserted")

        return newShip
      })
    }),
})

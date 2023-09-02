import { createId } from "@paralleldrive/cuid2"
import { and, eq, inArray, sql } from "drizzle-orm"
import { path, ship, tile } from "schema"
import { z } from "zod"
import { SHIP_TYPE_TO_SHIP_PROPERTIES } from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  type ValidationProps,
  getEnhancedShipPath,
  getTileObject,
  validateTileConflicts,
  validateFinalDestination,
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

        const userShip = await trx.query.ship.findFirst({
          where: eq(ship.id, shipId),
        })

        if (!userShip) throw new Error("No ship found with that id")

        const tiles = await trx.query.tile.findMany({
          where: inArray(tile.xyTileId, shipPath),
        })

        const mutableEvents: ValidationProps["mutableEvents"] = []
        const mutableEnhancedShipPath = getEnhancedShipPath(
          shipPath,
          startTime,
          userShip,
        )
        const userId = ctx.session.user.id

        const validationProps: ValidationProps = {
          tiles,
          userShip,
          shipPath,
          startTime,
          tilesObject: getTileObject(tiles),

          mutableEvents,
          mutableEnhancedShipPath,

          db: trx,
          userId,
        }

        // Validate if the ship hits land
        await validateTileConflicts(validationProps)

        // TODO: do some path validation?

        // TODO: check if the ship is already sailing

        // TODO: check for enemy interceptions

        // Validate if the ship is going to a city
        const destinationId = await validateFinalDestination(validationProps)

        const newPath = {
          pathArray: mutableEnhancedShipPath.map(({ xyTileId }) => xyTileId),
          createdAt: startTime,
          id: createId(),
        }

        // Add the path to the path list
        await trx.insert(path).values(newPath)

        // Update the ships location (prematurely)
        await trx
          .update(ship)
          // If there is no destination city, don't update the location of the ship
          .set({ cityId: destinationId })
          .where(eq(ship.id, shipId))

        return {
          path: newPath,
          ship: userShip,
          events: mutableEvents,
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

        const countOfShipType = parseInt(
          (
            await trx
              .select({ count: sql<string>`count(*)` })
              .from(ship)
              .where(
                and(
                  eq(ship.userId, ctx.session.user.id),
                  eq(ship.shipType, input.ship_type),
                ),
              )
          ).at(0)?.count ?? "0",
          10,
        )

        const partialNewShip = {
          id: createId(),
          userId: ctx.session.user.id,
          cityId: cityForNewShip.id,
          ...shipProperties,
          name: `${input.ship_type.toLowerCase()} ${countOfShipType + 1}`,
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

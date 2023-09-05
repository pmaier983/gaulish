import { createId } from "@paralleldrive/cuid2"
import { and, eq, inArray, sql } from "drizzle-orm"
import { path, ship, tile } from "schema"
import { z } from "zod"
import {
  MAX_SHIP_NAME_LENGTH,
  SHIP_TYPES,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
} from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  type ValidationProps,
  getEnhancedShipPath,
  getTileObject,
  validateTileConflicts,
  validateFinalDestination,
  validateShipCurrentSailingStatus,
  validateNpcConflicts,
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

        // Check if the ship is already sailing
        await validateShipCurrentSailingStatus(validationProps)

        // Check for enemy interceptions
        await validateNpcConflicts(validationProps)

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
      with: {
        path: true,
      },
    })
  }),
  /**
   * Adds a ship to a users profile
   */
  addFreeShip: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.transaction(async (trx) => {
      // TODO: properly choose a city!
      const cityForNewShip = await trx.query.city.findFirst()

      if (!cityForNewShip) throw Error("No cities found for the new ship")

      const shipProperties = SHIP_TYPE_TO_SHIP_PROPERTIES[SHIP_TYPES.PLANK]

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
                eq(ship.shipType, SHIP_TYPES.PLANK),
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
        name: `${SHIP_TYPES.PLANK.toLowerCase()} ${countOfShipType + 1}`,
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
  /**
   * Update a specific ships name
   */
  updateShipName: protectedProcedure
    .input(
      z.object({
        shipId: z.string(),
        newName: z.string().max(MAX_SHIP_NAME_LENGTH).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(ship)
        .set({ name: input.newName })
        .where(eq(ship.id, input.shipId))

      return input
    }),
})

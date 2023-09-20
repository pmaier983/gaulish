import { createId } from "@paralleldrive/cuid2"
import { and, eq } from "drizzle-orm"
import { type Ship, cargo, path, ship } from "schema"
import { z } from "zod"
import {
  FAKE_INITIAL_SHIP_PATH_ID,
  MAX_SHIP_NAME_LENGTH,
  SHIP_TYPES,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
} from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  type ValidationProps,
  getEnhancedShipPath,
  getTilesObject,
  validateTileConflicts,
  validateFinalDestination,
  validateShipCurrentSailingStatus,
  validateNpcConflicts,
  validateKnownTiles,
} from "~/utils/sailingUtils"

export const shipsRouter = createTRPCRouter({
  /**
   * Let a user sail their ship
   */
  // TODO: time this query to see how long it takes & if it needs optimization?
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
          with: {
            cargo: true,
            path: true,
          },
        })

        if (!userShip) throw new Error("No ship found with that id")

        const tiles = await trx.query.tile.findMany({})

        const mutableEvents: ValidationProps["mutableEvents"] = []
        const mutableEnhancedShipPath = getEnhancedShipPath(
          shipPath,
          startTime,
          userShip,
        )
        const userId = ctx.session.user.id

        const validationProps: ValidationProps = {
          tiles: tiles,
          userShip,
          shipPath,
          startTime,
          tilesObject: getTilesObject(tiles),

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

        // Add the known tiles to the ships events
        await validateKnownTiles(validationProps)

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
          .set({ cityId: destinationId, pathId: newPath.id })
          .where(eq(ship.id, shipId))

        // TODO: we can probably skip this if need be
        const updateShip = await trx.query.ship.findFirst({
          where: eq(ship.id, shipId),
          with: {
            path: true,
            cargo: true,
          },
        })

        if (!updateShip) throw new Error("No valid ship found mid sail?!")

        return {
          ship: updateShip,
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
        cargo: true,
      },
    })
  }),
  /**
   * Get a Ship by its ID
   */
  getShipById: protectedProcedure
    .input(
      z.object({
        shipId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.ship.findFirst({
        where: eq(ship.id, input.shipId),
        with: {
          path: true,
          cargo: true,
        },
      })
    }),
  /**
   * Adds a ship to a users profile
   *
   * - Add the tiles around that ship to the knowTiles list
   *
   */
  addFreeShip: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.transaction(async (trx) => {
      // TODO: properly choose a city!
      const cityForNewShip = await trx.query.city.findFirst()

      if (!cityForNewShip) throw Error("No cities found for the new ship")

      const shipProperties = SHIP_TYPE_TO_SHIP_PROPERTIES[SHIP_TYPES.PLANK]

      if (!shipProperties)
        throw Error("No ship properties found for that ship_type")

      const allUserShips = await trx.query.ship.findMany({
        where: and(eq(ship.userId, ctx.session.user.id)),
        columns: {
          isSunk: true,
          shipType: true,
        },
      })

      const currentUserShips = allUserShips.filter((ship) => !ship.isSunk)

      if (currentUserShips.length > 0) {
        throw Error("You already have a ship, No Freebies!")
      }

      const countOfPlanks = currentUserShips.filter(
        (ship) => ship.shipType === SHIP_TYPES.PLANK,
      ).length

      const newCargoId = createId()

      await trx.insert(cargo).values({ id: newCargoId })

      const partialNewShip: Ship = {
        id: createId(),
        userId: ctx.session.user.id,
        cityId: cityForNewShip.id,
        ...shipProperties,
        cargoId: newCargoId,
        isSunk: false,
        pathId: FAKE_INITIAL_SHIP_PATH_ID, // TODO: is there a better way to do this?
        name: `${SHIP_TYPES.PLANK.toLowerCase()} ${countOfPlanks + 1}`,
      }

      await trx.insert(ship).values(partialNewShip)

      const newShip = await trx.query.ship.findFirst({
        where: eq(ship.id, partialNewShip.id),
        with: {
          path: true,
          cargo: true,
        },
      })

      if (!newShip)
        throw new Error("Ship was not found immediately after being inserted")

      // TODO: Add the tiles around that ship to the knowTiles list

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

import { createId } from "@paralleldrive/cuid2"
import { and, eq, inArray } from "drizzle-orm"
import { path, ship, city, cargo } from "schema"
import { z } from "zod"
import {
  MAX_SHIP_NAME_LENGTH,
  SHIP_TYPES,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
} from "~/components/constants"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { addShip } from "~/server/utils"
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
    return await ctx.db.query.ship.findMany({
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

      const currentUserShips = await trx.query.ship.findMany({
        where: and(
          eq(ship.userId, ctx.session.user.id),
          eq(ship.isSunk, false),
        ),
        columns: {
          isSunk: true,
        },
      })

      if (currentUserShips.length > 0) {
        throw Error("You already have a ship, No Freebies!")
      }

      return await addShip({
        db: trx,
        shipType: SHIP_TYPES.PLANK,
        cityId: cityForNewShip.id,
        userId: ctx.session.user.id,
      })
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

  /**
   * Buy a ship from a city
   */
  buyShip: protectedProcedure
    .input(
      z.object({
        cityId: z.number(),
        shipType: z.nativeEnum(SHIP_TYPES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        // check if the user has enough gold in the city
        const shipsInCity = await trx.query.ship.findMany({
          where: and(
            eq(ship.cityId, input.cityId),
            eq(ship.isSunk, false),
            eq(ship.userId, ctx.session.user.id),
          ),
          with: {
            cargo: {
              columns: {
                id: true,
                gold: true,
              },
            },
          },
          columns: {},
        })

        const totalGoldInCity = shipsInCity.reduce(
          (acc, ship) => acc + ship.cargo.gold,
          0,
        )

        if (
          totalGoldInCity < SHIP_TYPE_TO_SHIP_PROPERTIES[input.shipType].price
        ) {
          throw new Error("Not enough gold in the city to purchase this ship!")
        }

        const goldRemainingInCity =
          totalGoldInCity - SHIP_TYPE_TO_SHIP_PROPERTIES[input.shipType].price
        const shipsCargoIds = shipsInCity.map((ship) => ship.cargo.id)

        // Remove all the gold from the ships in the city
        await trx
          .update(cargo)
          .set({ gold: 0 })
          .where(inArray(cargo.id, shipsCargoIds))

        const newShip = await addShip({
          db: trx,
          shipType: input.shipType,
          cityId: input.cityId,
          userId: ctx.session.user.id,
        })

        // Give the gold to the new ship!
        await trx
          .update(cargo)
          .set({ gold: goldRemainingInCity })
          .where(eq(cargo.id, newShip.cargoId))
      })

      // TODO: unify this with getUsersShips?
      return await ctx.db.query.ship.findMany({
        where: and(
          eq(ship.userId, ctx.session.user.id),
          eq(ship.isSunk, false),
        ),
        with: {
          cargo: true,
          path: true,
        },
      })
    }),
})

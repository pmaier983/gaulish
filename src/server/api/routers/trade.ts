import { createId } from "@paralleldrive/cuid2"
import { eq } from "drizzle-orm"
import { cargo, city, log, ship } from "schema"
import { z } from "zod"
import {
  CARGO_TYPES_LIST,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
} from "~/components/constants"
import { getSpotPrice } from "~/hooks/useGetPrice"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { getCargoSum } from "~/utils/utils"

export const tradeRouter = createTRPCRouter({
  /**
   * Buy Cargo
   */
  buyCargo: protectedProcedure
    .input(
      z.object({
        shipId: z.string(),
        cargoType: z.enum(CARGO_TYPES_LIST),
        amount: z.number(),
        // total price is unused, and is only here to help out the frontend
        totalPrice: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userShip = await ctx.db.query.ship.findFirst({
        where: eq(ship.id, input.shipId),
        columns: {
          id: true,
          shipType: true,
          cargoId: true,
          cityId: true,
          name: true,
        },
        with: {
          cargo: true,
        },
      })

      if (!userShip) throw new Error("No ship found with that id")

      const cargoSum = getCargoSum(userShip.cargo)

      const cargoCapacity =
        SHIP_TYPE_TO_SHIP_PROPERTIES[userShip.shipType].cargoCapacity

      const availableCargoSpace = cargoCapacity - cargoSum

      // Does the user have enough space
      if (availableCargoSpace < input.amount) {
        throw new Error("Not enough cargo space available")
      }

      const currentCity = await ctx.db.query.city.findFirst({
        where: eq(city.id, userShip.cityId),
        columns: {
          cityCargo: true,
        },
      })

      if (!currentCity) throw new Error("No city found with that id")

      const currentCargo = currentCity.cityCargo.find(
        (cargo) => cargo.type === input.cargoType,
      )

      if (!currentCargo)
        throw new Error("The city doesn't sell that cargo type!")

      const price = getSpotPrice({
        ...currentCargo,
        seed: userShip.cityId,
      })

      const totalPrice = price * input.amount

      // Can the user afford the cargo
      if (userShip.cargo.gold < totalPrice) {
        throw new Error("Not enough gold to buy that much cargo")
      }

      return await ctx.db.transaction(async (trx) => {
        await trx
          .update(cargo)
          .set({
            gold: userShip.cargo.gold - totalPrice,
            [input.cargoType]: userShip.cargo[input.cargoType] + input.amount,
          })
          .where(eq(cargo.id, userShip.cargoId))

        const newLog = {
          id: createId(),
          userId: ctx.session.user.id,
          shipId: userShip.id,
          text: `${userShip.name} purchased ${input.amount} ${input.cargoType} for ${totalPrice} gold`,
          createdAt: new Date(),
        }

        await trx.insert(log).values(newLog)

        return {
          newLogs: [newLog],
        }
      })
    }),

  /**
   * Sell Cargo
   */
  sellCargo: protectedProcedure
    .input(
      z.object({
        shipId: z.string(),
        cargoType: z.enum(CARGO_TYPES_LIST),
        amount: z.number(),
        // total price is unused, and is only here to help out the frontend
        totalPrice: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userShip = await ctx.db.query.ship.findFirst({
        where: eq(ship.id, input.shipId),
        columns: {
          id: true,
          shipType: true,
          cargoId: true,
          cityId: true,
          name: true,
        },
        with: {
          cargo: true,
        },
      })

      if (!userShip) throw new Error("No ship found with that id")

      // Check that the user has the cargo to sell
      if (userShip.cargo[input.cargoType] < input.amount) {
        throw new Error("Not enough cargo to sell")
      }

      const currentCity = await ctx.db.query.city.findFirst({
        where: eq(city.id, userShip.cityId),
        columns: {
          cityCargo: true,
        },
      })

      if (!currentCity) throw new Error("No city found with that id")

      const currentCargo = currentCity.cityCargo.find(
        (cargo) => cargo.type === input.cargoType,
      )

      // Check the city is buying that type of cargo
      if (!currentCargo)
        throw new Error("The city doesn't buy that cargo type!")

      const price = getSpotPrice({
        ...currentCargo,
        seed: userShip.cityId,
      })

      const totalPrice = price * input.amount

      return await ctx.db.transaction(async (trx) => {
        await trx
          .update(cargo)
          .set({
            gold: userShip.cargo.gold + totalPrice,
            [input.cargoType]: userShip.cargo[input.cargoType] - input.amount,
          })
          .where(eq(cargo.id, userShip.cargoId))

        const newLog = {
          id: createId(),
          userId: ctx.session.user.id,
          shipId: userShip.id,
          text: `${userShip.name} sold ${input.amount} ${input.cargoType} for ${totalPrice} gold`,
          createdAt: new Date(),
        }

        await trx.insert(log).values(newLog)

        return {
          newLogs: [newLog],
        }
      })

      // TODO: log the event
    }),
})

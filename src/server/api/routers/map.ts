import { eq } from "drizzle-orm"
import { type Npc, type Path, users } from "schema"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { getVisibleTilesFromXYTileId } from "~/utils/utils"

interface NpcWithPath extends Npc {
  path: Path
}

export const mapRouter = createTRPCRouter({
  /**
   * Fetch a list of all the tiles
   */
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.tile.findMany({})
  }),

  /**
   * Fetch a list of all the cities
   */
  getCities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.city.findMany({})
  }),

  /**
   * Fetch a list of NPCs with their ships & paths attached
   */
  getNpcs: protectedProcedure.query(async ({ ctx }) => {
    const npcs = await ctx.db.query.npc.findMany({
      with: {
        path: true,
      },
    })
    return npcs.filter(
      // Type Guards (https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types)
      (npcAndPath): npcAndPath is NpcWithPath => !!npcAndPath.path,
    )
  }),

  getKnownTiles: protectedProcedure.query(async ({ ctx }) => {
    const possibleKnownTiles = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        knownTiles: true,
      },
    })

    const knownTiles = possibleKnownTiles?.knownTiles ?? []

    /**
     * If the user has no known tiles
     *
     * - Start them off with a diamond around the starter city
     * - And single tile knowledge of all other cities
     *
     */
    if (knownTiles.length === 0) {
      const mapArray = await ctx.db.query.tile.findMany({})
      const firstCity = await ctx.db.query.city.findFirst()
      const cityArray = await ctx.db.query.city.findMany({})

      if (!firstCity) throw Error("No cities found!")

      const mapObject =
        mapArray?.reduce<{ [key: string]: boolean }>((acc, tile) => {
          acc[`${tile.x}:${tile.y}`] = true
          return acc
        }, {}) ?? {}

      const diamondAroundStarterCity = getVisibleTilesFromXYTileId({
        xyTileId: firstCity.xyTileId,
        mapObject,
        visibilityStrength: 3,
      })

      const deduplicatedNewKnownTiles = [
        ...new Set([
          ...diamondAroundStarterCity,
          ...cityArray.map((city) => city.xyTileId),
        ]),
      ]

      await ctx.db
        .update(users)
        .set({ knownTiles: deduplicatedNewKnownTiles })
        .where(eq(users.id, ctx.session.user.id))

      return deduplicatedNewKnownTiles
    }

    return knownTiles
  }),
})

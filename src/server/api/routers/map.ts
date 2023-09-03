import { type Npc, type Path, city, tile } from "schema"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

interface NpcWithPath extends Npc {
  path: Path
}

export const mapRouter = createTRPCRouter({
  /**
   * Fetch a list of all the tiles
   */
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tile)
  }),

  /**
   * Fetch a list of all the cities
   */
  getCities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(city)
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
})

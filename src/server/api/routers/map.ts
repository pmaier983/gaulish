import { eq } from "drizzle-orm"
import { type Npc, type Path, city, npc, path, tile } from "schema"

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

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

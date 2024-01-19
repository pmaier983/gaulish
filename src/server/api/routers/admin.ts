import { path, tile, city, npc, type Tile, type Npc, type City } from "schema"

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc"
import mapDefaults from "~/../maps/map-0.json"

// TODO: Use Type Guards here instead of assertions
const DEFAULT_MAP = Object.values(mapDefaults.mapObject) as Tile[]

const DEFAULT_PATHS = mapDefaults.npcs.map((npc) => ({
  id: npc.id.toString(),
  pathArray: npc.pathArray,
}))

const DEFAULT_NPCS = mapDefaults.npcs.map((npc) => ({
  ...npc,
  pathId: npc.id.toString(),
})) as Npc[]

const DEFAULT_CITIES = mapDefaults.cities as City[]

// TODO: use relational queries for things?
export const adminRouter = createTRPCRouter({
  setupDefaultGamestate: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.db.transaction(async (trx) => {
      await trx.insert(tile).values(DEFAULT_MAP)
      await trx.insert(npc).values(DEFAULT_NPCS)
      await trx.insert(path).values(DEFAULT_PATHS)
      await trx.insert(city).values(DEFAULT_CITIES)
    })
  }),
  clearDefaultGamestate: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.db.transaction(async (trx) => {
      await trx.delete(tile)
      await trx.delete(npc)
      await trx.delete(path)
      await trx.delete(city)
    })
  }),
})

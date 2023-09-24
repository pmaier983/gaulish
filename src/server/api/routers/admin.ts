import { path, tile, city, npc } from "schema"

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc"
import {
  DEFAULT_CITIES,
  DEFAULT_MAP,
  DEFAULT_NPCS,
  DEFAULT_PATHS,
} from "~/server/defaults"

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

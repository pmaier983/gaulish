import { accounts, tile } from "schema"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc"

// TODO - add all the following api paths:
// - getMap
// - setMap (admin only)
// - getUserStats
// - getUserShips
// - getNpcPaths
// - getUserShipPaths
//   - update this list constantly with websockets.

export const generalRouter = createTRPCRouter({
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tile)
  }),
  setTile: adminProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(tile).values({ id: 2, x: 1, y: 1 })
  }),
})

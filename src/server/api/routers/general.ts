import { tile } from "schema"
import { CELL_TYPES, CELL_TYPE_TO_TYPE_ID } from "~/components/constants"

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
    return ctx.db.insert(tile).values({
      id: 2,
      x: 1,
      y: 1,
      type_id: CELL_TYPE_TO_TYPE_ID[CELL_TYPES.OCEAN],
    })
  }),
})

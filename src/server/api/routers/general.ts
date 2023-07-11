import { eq } from "drizzle-orm"
import { npc, path, tile } from "schema"
import { TILE_TYPES, TILE_TYPE_TO_TYPE_ID } from "~/components/constants"

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc"
import { ADMINS } from "~/server/auth"

// TODO - add all the following api paths:
// - getMap
// - setMap (admin only)
// - getUserStats
// - getUserShips
// - getNpcPaths
// - getUserShipPaths
//   - update this list constantly with websockets.

export const generalRouter = createTRPCRouter({
  // TODO: implement map rendering on the client
  getAllTiles: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(tile)
  }),
  isUserAdmin: protectedProcedure.query(({ ctx }) => {
    return ADMINS.includes(ctx.session.user.email ?? "")
  }),
  setTile: adminProcedure.mutation(({ ctx }) => {
    return ctx.db.insert(tile).values({
      id: 2,
      x: 1,
      y: 1,
      type_id: TILE_TYPE_TO_TYPE_ID[TILE_TYPES.OCEAN],
    })
  }),
  getNpcs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(npc).leftJoin(path, eq(path.id, npc.pathId))
  }),
})

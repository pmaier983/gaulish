import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc"
import { account } from "~/../schema/Account"

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(account)
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!"
  }),
})

import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc"
import { account, example } from "schema"

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

  setExample: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db
      .insert(example)
      .values({ updatedAt: new Date(), id: new Date().getTime().toString() })
  }),
})

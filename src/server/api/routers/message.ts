import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  send: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      return input
    })
})
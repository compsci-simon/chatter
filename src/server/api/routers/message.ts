import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { Post } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const ee = new EventEmitter()

export const messageRouter = createTRPCRouter({
  send: publicProcedure
    .input(z.object({ author: z.string(), content: z.string(), chatroom: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.create({
        data: { ...input }
      })
      ee.emit('onAdd', post)
      return post
    }),
  onAdd: publicProcedure.subscription(() => {
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => emit.next(data)
      ee.on('onAdd', onAdd)

      return () => {
        ee.off('onAdd', onAdd)
      }
    })
  })
})
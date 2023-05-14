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
  infinite: publicProcedure
    .input(z.object({
      cursor: z.string().nullish(),
      take: z.number().min(1).max(50).nullish()
    }))
    .query(async ({ ctx, input }) => {
      console.log('called infinite query.')
      const take = input.take ?? 10
      const cursor = input.cursor
      const page = await ctx.prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        cursor: cursor ? {
          id: cursor
        } : undefined,
        take: take + 1,
        skip: 0
      })

      const items = page.reverse()
      let prevCursor: null | typeof cursor = null
      if (items.length > take) {
        const prev = items.shift()
        prevCursor = prev?.id
      }
      return {
        items,
        prevCursor
      }
    }),
  onAdd: publicProcedure.subscription(() => {
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => emit.next(data)
      ee.on('onAdd', onAdd)

      return () => {
        ee.off('onAdd', onAdd)
      }
    })
  }),
})
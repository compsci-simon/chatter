import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";
import { Post } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { copyFileSync } from "fs";

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
      chatroom: z.string(),
      cursor: z.string().nullish(),
      take: z.number().min(1).max(50).nullish()
    }))
    .query(async ({ ctx, input }) => {
      const take = input.take ?? 10
      const cursor = input.cursor
      const chatroom = input.chatroom
      const page = await ctx.prisma.post.findMany({
        where: {
          chatroom
        },
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
  onAdd: publicProcedure
    .input(z.object({ chatroom: z.string() }))
    .subscription(({ input }) => {
      return observable<Post>((emit) => {
        const onAdd = (data: Post) => {
          if (input.chatroom === data.chatroom) {
            emit.next(data)
          }
        }
        ee.on('onAdd', onAdd)

        return () => {
          ee.off('onAdd', onAdd)
        }
      })
    })
})
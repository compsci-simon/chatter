import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { observable } from "@trpc/server/observable";
import { Post } from "@prisma/client";
import EventEmitter from "events";

const ee = new EventEmitter()

export const socketRouter = createTRPCRouter({
  socket: publicProcedure
    .input(z.object({ chatroom: z.string() }))
    .subscription(() => {
      return observable<Post>((emit) => {
        const send = (data: Post) => emit.next(data)
        ee.on('send', send)

        return () => {
          ee.off('send', send)
        }
      })
    })
})
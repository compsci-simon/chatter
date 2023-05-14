import * as trpcNext from '@trpc/server/adapters/next'
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'
import { IncomingMessage } from 'http'
import ws from 'ws'
import { prisma } from "./db";

export const createContext = (
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) => {
  return {
    prisma
  }
}
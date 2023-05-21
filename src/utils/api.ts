/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink, createWSClient, wsLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { NextPageContext } from "next";
import superjson from "superjson";

import { type AppRouter } from "../server/api/root";
import getConfig from "next/config";

interface RuntimeConfig {
  HOST: string
  NEXT_PORT: string
  WSS_PORT: string
}

const { publicRuntimeConfig }: {
  publicRuntimeConfig: RuntimeConfig
} = getConfig() as { publicRuntimeConfig: RuntimeConfig }

const { HOST, NEXT_PORT, WSS_PORT } = publicRuntimeConfig;

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `http:${HOST}:${NEXT_PORT}/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {}
        }
        return {
          ...ctx.req.headers
        }
      },
    })
  }
  const client = createWSClient({
    url: `ws://${HOST}:${WSS_PORT}`
  })
  return wsLink<AppRouter>({
    client
  })
}

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            networkMode:
              process.env.NODE_ENV === "development" ? "always" : "online",
          },
          mutations: {
            networkMode:
              process.env.NODE_ENV === "development" ? "always" : "online",
          }
        },
      },
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink(ctx)
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

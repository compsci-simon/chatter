import next from "next";
import { createContext } from "./context";
import http from 'http'
import { parse } from 'url'
import ws from 'ws'
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./api/root";

const dev = process.env.NODE_ENV !== 'production'
// const { NEXT_PUBLIC_HOST, NEXT_PORT } = { HOST: 'localhost', NEXT_PORT: 80 }
const NEXT_PUBLIC_PORT = parseInt(process.env.NEXT_PUBLIC_PORT || '3000', 10)
const app = next({ dev })
const handle = app.getRequestHandler()

void app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    void handle(req, res, parsedUrl)
  })

  const wss = new ws.Server({ server })
  const handler = applyWSSHandler({ wss, router: appRouter, createContext })

  process.on('SIGTERM', () => {
    console.log('SIGTERM')
    handler.broadcastReconnectNotification()
  })
  server.listen(NEXT_PUBLIC_PORT)

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://HOST:${NEXT_PUBLIC_PORT} as ${dev ? 'development' : process.env.NODE_ENV}`,
  );
})
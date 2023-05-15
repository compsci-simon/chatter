import { appRouter } from "./api/root";
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import ws from 'ws'
import { createContext } from "./context";

const port = 3000
const wss = new ws.Server({
  port
})
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (socket) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  socket.on('message', message => {
    console.log('message received: %s', message);
  })
  socket.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})
console.log(`✅ WebSocket Server listening on ws://localhost:${port}`)

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  handler.broadcastReconnectNotification()
  wss.close()
})
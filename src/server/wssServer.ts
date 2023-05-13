import { appRouter } from "./api/root";
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import ws from 'ws'
import { createContext } from "./context";

const port = 3001
const wss = new ws.Server({
  port
})


wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`)
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`)
  })
})
console.log(`✅ WebSocket Server listening on ws://localhost:${port}`)

process.on('SIGTERM', () => {
  console.log('SIGTERM')
  wss.close()
})
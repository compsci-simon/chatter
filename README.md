# Chatter

---

Chatter is an online chat app that allows people to join a chatroom and chat with one another. Chatter uses websockets to provide a realtime chat experience.

### Description

---

Chatter is built using the t3 stack (Typescript, tRPC, and Tailwind). The stack also includes NextJS, and Prisma. The main goal of this project was for me to gain understanding of how web sockets are used.

### Challenges

---

Setting up the web sockets was the most challenging as I have no prior experience with web sockets. I quite enjoyed thoroughly reading the tRPC docs to gain a better understanding of the technology. I am also relatively new to NextJS, and browsed the docs once again to learn more about routing and passing parameters around.

### Nuggets of information

- I have not used curors before for paginating results from a database, but this is quite a cool technique that I discovered while building this application.
- I also discovered `useInfiniteQuery` while building this application which is a cool feature of ReactQuery.

### Struggles

- For quite a while I struggled to get websockets to work properly. I had an issue where the front end would make requests to the back end and the back end simply would not respong. I did not see anything in the network tab either which confused me. tRPC send RPC's over the open socket to the web socket server if the server is open. If I disabled the link that sent requests to the web socket server, the normal requests would work, but it is quite important that the web sockets work. What I did to try debug the issue was to add logging to establish whether the trpc server was receiving any messages. It turns out it was not.

It turns out that `handler.broadcastReconnectNotification()` inside the web socket server is quite important. I have no idea why we need to broadcast a reconnect notification as a I was not aware a SIGTERM signal had been given, as I did not quite the server with Ctrl+c.

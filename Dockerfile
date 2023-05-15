##### DEPENDENCIES

FROM --platform=linux/amd64 node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./prisma

# Install dependencies based on the preferred package manager

COPY package.json package-lock.json ./

RUN npm ci
RUN npx prisma generate

##### BUILDER

FROM --platform=linux/amd64 node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

##### RUNNER

FROM --platform=linux/amd64 node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV APP_URL http://localhost:80
ENV WS_URL ws://localhost:80
ENV DATABASE_URL file:./db.sqlite


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./prisma/db.sqlite ./db.sqlite
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 80
ENV PORT 80

CMD ["npm", "run", "start"]

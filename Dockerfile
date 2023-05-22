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

ENV NODE_ENV production

RUN npm run build

##### RUNNER

FROM --platform=linux/amd64 node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL file:/app/db.sqlite
ENV NEXT_PUBLIC_HOST chatter.simonsteven.io
ENV NEXT_PUBLIC_HTTP_PORT 80
ENV NEXT_PUBLIC_WSS_PORT 80
ENV NEXT_PUBLIC_PORT 80

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY prisma/db.sqlite ./db.sqlite
COPY .env.production ./
COPY next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:node /app

USER nextjs
EXPOSE 80
ENV PORT 80

CMD ["npm", "run", "start"]

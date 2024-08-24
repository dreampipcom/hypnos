FROM node:20 AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
RUN mkdir -p ./prisma
COPY prisma/schema-* ./prisma
RUN mkdir -p ./patches
COPY patches/* ./patches
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app


# ARGS VARS
ARG AUTH_SECRET
ARG AUTH_URL
ARG MAIN_URL
ARG API_URL
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG INSTAGRAM_CLIENT_ID
ARG INSTAGRAM_CLIENT_SECRET
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET
ARG APPLE_CLIENT_ID
ARG APPLE_CLIENT_SECRET

# ENV FROM ARGS VARS
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV MAIN_URL=$MAIN_URL
ENV API_URL=$API_URL
ENV GITHUB_ID=$GITHUB_ID
ENV GITHUB_SECRET=$GITHUB_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV INSTAGRAM_CLIENT_ID=$INSTAGRAM_CLIENT_ID
ENV INSTAGRAM_CLIENT_SECRET=$INSTAGRAM_CLIENT_SECRET
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET
ENV APPLE_CLIENT_ID=$APPLE_CLIENT_ID
ENV APPLE_CLIENT_SECRET=$APPLE_CLIENT_SECRET

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD [ "npm", "run", "start:vm:pm2" ]
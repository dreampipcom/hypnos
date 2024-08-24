FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
ARG NEXUS_STANDALONE
ENV NEXUS_STANDALONE=$NEXUS_STANDALONE

# Install dependencies based on the preferred package manager
RUN mkdir -p ./prisma
COPY prisma/schema-* ./prisma
RUN mkdir -p ./patches
COPY patches/* ./patches
COPY postInstall.js ./
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
COPY --from=deps /app/package.json /app/yarn.lock* /app/package-lock.json* /app/pnpm-lock.yaml* ./
COPY --from=deps /app/prisma/schema-* ./prisma
RUN npm run schema:generate:all:standalone

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1


# ARGS VARS
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
ARG EMAIL_FROM
ARG EMAIL_SERVER

ARG AUTH_TRUST_HOST
ARG AUTH_SECRET
ARG AUTH_URL
ARG MAIN_URL
ARG API_URL

ARG KV_REST_API_READ_ONLY_TOKEN
ARG KV_REST_API_TOKEN
ARG KV_REST_API_URL
ARG KV_URL

ARG MONGODB_DATABASE
ARG MONGODB_USERS_DATABASE
ARG MONGODB_ORGS_DATABASE
ARG MONGODB_DEFAULT_ORG

ARG PRISMA_PRIVATE_URI
ARG MONGODB_PRIVATE_URI
ARG PRISMA_PUBLIC_URI
ARG MONGODB_PUBLIC_URI

ARG NEXUS_MODE

# ENV FROM ARGS VARS
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

ENV EMAIL_FROM=$EMAIL_FROM
ENV EMAIL_SERVER=$EMAIL_SERVER

ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
ENV MAIN_URL=$MAIN_URL
ENV API_URL=$API_URL


ENV KV_REST_API_READ_ONLY_TOKEN=$KV_REST_API_READ_ONLY_TOKEN
ENV KV_REST_API_TOKEN=$KV_REST_API_TOKEN
ENV KV_REST_API_URL=$KV_REST_API_URL
ENV KV_URL=$KV_URL

ENV MONGODB_DATABASE=$MONGODB_DATABASE
ENV MONGODB_USERS_DATABASE=$MONGODB_USERS_DATABASE
ENV MONGODB_ORGS_DATABASE=$MONGODB_ORGS_DATABASE
ENV MONGODB_DEFAULT_ORG=$MONGODB_DEFAULT_ORG

ENV PRISMA_PRIVATE_URI=$PRISMA_PRIVATE_URI
ENV MONGODB_PRIVATE_URI=$MONGODB_PRIVATE_URI
ENV PRISMA_PUBLIC_URI=$PRISMA_PUBLIC_URI
ENV MONGODB_PUBLIC_URI=$MONGODB_PUBLIC_URI

ENV NEXUS_MODE=$NEXUS_MODE

RUN \
  if [ -f yarn.lock ]; then yarn run build:vm; \
  elif [ -f package-lock.json ]; then npm run build:vm; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build:vm; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app


ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN npm i -g pm2

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
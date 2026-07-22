FROM node:22-alpine AS base
# Pin pnpm to match the commonpub repo's Dockerfile. pnpm@latest used
# to work but newer pnpm versions (≥10.11 ish) enforce
# `onlyBuiltDependencies` strictly and fail the install on packages
# with build scripts (sharp, esbuild, @parcel/watcher) that haven't
# been explicitly approved. Pinning gives us deterministic builds and
# avoids surprise behaviour changes from upstream pnpm releases.
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
WORKDIR /app

# Use npm install (not pnpm). pnpm 10.10.0 --frozen-lockfile silently DROPS
# files from @commonpub/* dist dirs in this Alpine image, so the built .output
# ships incomplete/stale package code (e.g. an old listContent without the
# pagination tiebreaker) and the new container fails its health check while the
# old one keeps serving. npm install pulls complete packages (matches the
# working heatsynclabs.io Dockerfile).
#
# The committed package-lock.json is REQUIRED as a resolution seed. A lockless
# from-scratch resolve of the deep multi-version @commonpub tree crashes npm 10's
# arborist ("Cannot read properties of null (reading 'edgesOut')"). Seeding from
# the lock takes the reconcile path (no crash) AND installs @commonpub/editor's
# @tiptap/* peers — which --legacy-peer-deps silently drops, breaking the Nuxt
# build at `@tiptap/pm/model`. `npm install` (not `npm ci`): ci rejects this tree
# on the two-commander-majors state; install reconciles it. Matches heatsync.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
RUN addgroup -S deveco && adduser -S deveco -G deveco
WORKDIR /app
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/scripts ./scripts
# Install drizzle-kit + deps for schema push (drizzle-kit needs drizzle-orm + pg driver, schema imports zod)
RUN echo '{"private":true,"type":"module"}' > package.json && npm install --no-save drizzle-kit@0.31.10 drizzle-orm pg zod
# Copy schema dist to root node_modules (for drizzle-kit push) and .output (for Nitro runtime)
COPY --from=build /app/node_modules/@commonpub/schema/dist ./node_modules/@commonpub/schema/dist
COPY --from=build /app/node_modules/@commonpub/schema/migrations ./node_modules/@commonpub/schema/migrations
COPY --from=build /app/node_modules/@commonpub/schema/package.json ./node_modules/@commonpub/schema/package.json
COPY --chown=deveco:deveco --from=build /app/.output ./.output
COPY --from=build /app/node_modules/@commonpub/schema/dist ./.output/server/node_modules/@commonpub/schema/dist
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => { if(r.statusCode !== 200) throw new Error() })"
USER deveco
CMD ["node", ".output/server/index.mjs"]

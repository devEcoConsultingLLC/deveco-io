FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

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

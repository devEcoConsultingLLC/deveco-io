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
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/node_modules/@commonpub/schema/dist ./node_modules/@commonpub/schema/dist
# Install drizzle-kit + deps for schema push (drizzle-kit needs drizzle-orm + pg driver)
RUN echo '{"private":true,"type":"module"}' > package.json && npm install --no-save drizzle-kit@0.31.10 drizzle-orm pg
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

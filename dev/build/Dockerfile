FROM docker.io/library/node:20.20.2-bookworm-slim AS base
RUN corepack enable pnpm

WORKDIR /tiddlyrag

# ------

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

# ------

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && pnpm store prune

COPY . .
RUN pnpm run build

# ------

FROM base AS deployment

COPY . .
COPY --from=prod-deps /tiddlyrag/node_modules /tiddlyrag/node_modules
COPY --from=build /tiddlyrag/dist /tiddlyrag/dist

EXPOSE 3000
CMD [ "pnpm", "start" ]

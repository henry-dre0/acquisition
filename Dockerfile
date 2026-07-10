# ─────────────────────────────────────────────
#  DOCKERFILE — multi-stage build
# ─────────────────────────────────────────────
#  Stages:
#    base   → copies package.json only (shared)
#    deps   → installs ALL dependencies
#    dev    → deps + source code + hot-reload
#    prod   → production deps only + source
#
#  🔧 Build for dev:
#     docker compose -f docker-compose.dev.yml up
#
#  🔧 Build for prod:
#     docker compose -f docker-compose.prod.yml up
# ─────────────────────────────────────────────

FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci

FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]

FROM base AS prod
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]

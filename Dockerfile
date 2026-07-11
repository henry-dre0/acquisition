# ─────────────────────────────────────────────
#  DOCKERFILE — multi-stage build
# ─────────────────────────────────────────────
#  Stages:
#    base        → copies package.json, creates non-root user
#    development → installs ALL deps + hot-reload
#    production  → installs only production deps + HEALTHCHECK
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

# install production deps first (shared cache layer)
RUN npm ci --only=production && npm cache clean --force

# create non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

# ── DEVELOPMENT ──────────────────────────────
FROM base AS development

# temporarily switch to root so npm can write node_modules
USER root

# install dev dependencies on top of existing production deps
RUN npm ci && npm cache clean --force

COPY . .
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000
CMD ["node", "--watch", "src/index.js"]

# ── PRODUCTION ────────────────────────────────
FROM base AS production

COPY . .
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

CMD ["node", "src/index.js"]

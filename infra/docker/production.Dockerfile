# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/

RUN npm ci --workspace @app/frontend --workspace @app/backend --include-workspace-root

COPY apps/frontend apps/frontend
COPY packages/shared-types packages/shared-types

ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build --workspace @app/frontend

FROM node:20-alpine AS runtime
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/

RUN npm ci --workspace @app/backend --omit=dev --include-workspace-root

COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types
COPY --from=build /app/apps/frontend/dist apps/frontend/dist

WORKDIR /app/apps/backend

ENV NODE_ENV=production
ENV SERVE_FRONTEND=true
EXPOSE 5000

CMD ["sh", "-c", "node -e \"import('./src/db/initDb.js').then(m=>m.initDatabase())\" && node src/server.js"]

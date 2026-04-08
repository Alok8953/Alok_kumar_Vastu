# Alok Kumar Mishra Website Monorepo

Scalable monorepo structure with separated frontend and backend applications.

## Architecture

- `apps/frontend/` - React + Vite client
- `apps/backend/` - Node + Express API
- `packages/shared-types/` - shared response contracts
- `packages/shared-config/` - shared config placeholder for lint/env conventions
- `infra/` - deployment/container templates
- `docs/` - architecture notes

## Run locally

1. Install dependencies:
   - `npm install`
2. Run both apps:
   - `npm run dev`
3. App URLs:
   - Frontend: `http://localhost:5173`
   - Backend health: `http://localhost:5000/api/health`

## Useful commands

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run start`

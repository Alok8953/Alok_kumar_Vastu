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
   - Review approvals (admin): `http://localhost:5173/#admin/reviews` — use `ADMIN_API_KEY` from `apps/backend/.env`

## Client review approvals

1. Visitor submits a review (Stories → Share Your Experience).
2. You receive an email with **Approve & publish on website** and **Reject** buttons.
3. Click approve — the review goes live under **Client Success Stories** on the homepage.
4. Optional: advanced admin at `/#admin/reviews` (uses `ADMIN_API_KEY` in `apps/backend/.env`).

## Useful commands

- `npm run dev:frontend`
- `npm run dev:backend`
- `npm run build`
- `npm run start`

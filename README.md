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

## Publish on vastualok.com (Render + custom domain)

Hosting stays on Render; visitors use **https://vastualok.com** instead of `*.onrender.com`.

### 1. Render environment variables

In Render → your web service → **Environment**, set:

| Variable | Value |
|----------|--------|
| `FRONTEND_ORIGIN` | `https://vastualok.com` |
| `BACKEND_PUBLIC_URL` | `https://vastualok.com` |
| `SERVE_FRONTEND` | `true` |
| `DATABASE_URL` | (your Neon/Render Postgres URL) |
| `RESEND_API_KEY` | (from resend.com) |
| `RESEND_FROM` | `Vastu Website <noreply@vastualok.com>` after domain verify |
| `TO_EMAIL` | your inbox |
| `ADMIN_API_KEY` | long secret |

Leave `VITE_API_BASE_URL` **empty** — the Docker build serves frontend + API on one domain.

### 2. Connect custom domain in Render

Render → **Settings** → **Custom Domains**:

- Add `vastualok.com`
- Add `www.vastualok.com` (optional; redirects to apex)

### 3. DNS at your domain registrar

Point the domain to Render (Render shows exact records after you add the domain):

- **Root (`vastualok.com`)**: A record → Render load balancer IP, **or** ANAME/ALIAS if your registrar supports it
- **www**: CNAME → your Render service hostname (e.g. `alok-kumar-vastu.onrender.com`)

Wait 5–30 minutes for DNS + Render SSL (HTTPS is automatic).

### 4. Redeploy

Push latest code to GitHub (or **Manual Deploy** on Render). Then open:

- https://vastualok.com
- https://vastualok.com/api/health

Review approval emails will use `https://vastualok.com/api/reviews/approve-email?...`.

### 5. Resend domain (for reliable email)

At [resend.com/domains](https://resend.com/domains), verify **vastualok.com** and set `RESEND_FROM` to an address on that domain.

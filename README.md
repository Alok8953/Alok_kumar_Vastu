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
- `npm run docker:prod` — VPS with nginx + HTTPS certs
- `npm run docker:simple` — quick VPS test on port 80

## Publish on vastualok.com (your domain — no Render)

This project is configured for **self-hosted deployment** on your own server (VPS).  
Pushing to GitHub **does not deploy anywhere** unless you add your own CI/CD.

Database: keep using **Neon PostgreSQL** (`DATABASE_URL` in `apps/backend/.env`) — no need to run Postgres on the VPS unless you prefer it.

### 1. Stop Render (one-time, in Render dashboard)

If you previously connected this repo to Render:

1. [dashboard.render.com](https://dashboard.render.com) → open service **vastu-website**
2. **Settings** → **Delete Web Service** (and delete **vastu-db** if Render created it — you use Neon instead)
3. **Disconnect** the GitHub repo if prompted

`render.yaml` has been removed from this repo so new Blueprint deploys will not start.

### 2. Production environment

Copy `apps/backend/.env.production.example` → `apps/backend/.env` on the server and set:

| Variable | Value |
|----------|--------|
| `FRONTEND_ORIGIN` | `https://vastualok.com` |
| `BACKEND_PUBLIC_URL` | `https://vastualok.com` |
| `SERVE_FRONTEND` | `true` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | your Neon connection string |
| `RESEND_API_KEY` | from resend.com |
| `RESEND_FROM` | `Vastu Website <noreply@vastualok.com>` after domain verify |
| `TO_EMAIL` | your inbox |
| `ADMIN_API_KEY` | long secret |

Leave `VITE_API_BASE_URL` **empty** — frontend and API share one domain.

### 3. Deploy on a VPS (Ubuntu recommended)

On your Windows machine (prepare build):

```powershell
cd c:\Alok_Kumar_Vastu\Vastu_proj
powershell -ExecutionPolicy Bypass -File scripts/prepare-hosting.ps1
```

Upload the `Vastu_proj` folder to the server, then on the server:

```bash
cd Vastu_proj
docker compose -f infra/docker-compose.simple.yml --env-file apps/backend/.env up -d --build
```

Quick test: `http://YOUR-SERVER-IP/api/health`

For HTTPS with nginx, use `infra/docker-compose.prod.yml` after placing SSL certs in `infra/nginx/certs/` (see Certbot below).

### 4. DNS at your domain registrar

Point **vastualok.com** to your VPS (not Render):

| Type | Name | Value |
|------|------|--------|
| A | `@` | your VPS public IP |
| A or CNAME | `www` | your VPS IP or `vastualok.com` |

Wait 5–30 minutes for DNS to propagate.

### 5. HTTPS (Let's Encrypt on VPS)

On the server (example with Certbot):

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d vastualok.com -d www.vastualok.com
# Copy certs into infra/nginx/certs/ (fullchain.pem, privkey.pem)
docker compose -f infra/docker-compose.prod.yml --env-file apps/backend/.env up -d --build
```

Then open:

- https://vastualok.com
- https://vastualok.com/api/health

Review approval emails will use `https://vastualok.com/api/reviews/approve-email?...`.

### 6. Resend domain (for reliable email)

At [resend.com/domains](https://resend.com/domains), verify **vastualok.com** and set `RESEND_FROM` to an address on that domain.

### What we need from you

To finish going live on **vastualok.com** only, please share:

1. **VPS provider + public IP** (e.g. DigitalOcean, AWS, Hostinger VPS), or say if you need help choosing one
2. **Domain registrar** (where you bought vastualok.com) — so DNS steps can be exact
3. Confirm **Neon `DATABASE_URL`** stays as-is (recommended)

# Architecture

## Runtime flow

- Browser calls frontend app.
- Frontend requests backend APIs over HTTP.
- Backend serves API routes and returns JSON contracts from `@repo/shared-types`.

## Scalability baseline

- Independent frontend and backend workspaces.
- Feature-oriented frontend folders.
- Layered backend folders (`routes`, `controllers`, `services`).
- Shared contracts package to prevent request/response drift.

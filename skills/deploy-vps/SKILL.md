# Deploy VPS Skill

## Purpose

Deploy the monorepo to a fresh VPS using GHCR-hosted images, Docker Compose, Caddy, Cloudflare Tunnel, a signed deploy webhook, and a persistent local libSQL/SQLite database file accessed through the Turso/libSQL client.

## When to use this skill

Use this skill when preparing production deployment, bootstrapping a new VPS, rotating deploy infrastructure, validating rollout/rollback steps, or documenting the self-hosted production path.

## Architecture overview

- `web` serves the Next.js UI
- `server` serves REST routes and the MCP endpoint from one Hono runtime
- `caddy` reverse proxies internal services
- `cloudflared` exposes the private stack through Cloudflare Tunnel
- `deploy-hook` receives signed deploy requests from GitHub Actions
- the database remains a local libSQL/SQLite file mounted on persistent storage

## Services on the VPS

- `web`
- `server`
- `caddy`
- `cloudflared`
- `deploy-hook`

## Persistent storage expectations

- Mount `/data` as durable storage on the VPS host
- Store the production DB at `/data/app.db`
- Never rely on a container filesystem for DB persistence
- Back up `/data/app.db` and its WAL/SHM companion files regularly

## Required secrets

- `GHCR_USERNAME`
- `GHCR_TOKEN`
- `DEPLOY_WEBHOOK_SECRET`
- `DEPLOY_WEBHOOK_URL`
- Cloudflare Tunnel credentials JSON
- Cloudflare Tunnel ID

## Fresh VPS bootstrap steps

1. Install Docker Engine and Docker Compose plugin.
2. Create an app directory such as `/srv/hello-monorepo`.
3. Create `/data` and ensure the deploy user can read and write it.
4. Copy `infra/docker/compose.prod.yml`, `infra/caddy/Caddyfile`, and `infra/cloudflared/config.yml` to the VPS.
5. Add production env files for `apps/server`, `apps/web`, and `infra/deploy`.
6. Place the Cloudflare Tunnel credentials file where `cloudflared` can mount it.
7. Log in to GHCR from the VPS host if you plan to pull manually.

## Compose expectations

- `server` mounts `/data` and points `DATABASE_URL` to `file:/data/app.db`
- `web`, `server`, and `deploy-hook` use GHCR image tags injected at deploy time
- `caddy` and `cloudflared` stay long-lived and stable between application deploys
- migrations run explicitly during deploy, not implicitly during every container boot

## Caddy expectations

- Caddy listens only behind Cloudflare Tunnel
- `app.example.com` proxies to `web`
- `api.example.com` proxies to `server`
- `mcp.example.com` proxies to `server`
- `deploy.example.com` proxies to `deploy-hook`

## Cloudflared expectations

- Cloudflare Tunnel terminates at the edge and forwards traffic to `caddy`
- ingress rules must cover `app.example.com`, `api.example.com`, `mcp.example.com`, and `deploy.example.com`
- the tunnel credentials file must stay out of the repo

## Deploy hook expectations

- The deploy hook accepts only signed POST requests
- The signature is an HMAC SHA-256 over the raw JSON payload
- The deploy hook pulls new image tags, runs migrations against `/data/app.db`, restarts services, and returns a JSON result

## Migration procedure

1. Pull the target `server` image.
2. Run `pnpm db:migrate` with `DATABASE_URL=file:/data/app.db`.
3. Restart `server` after migrations complete successfully.
4. Restart `web` once the API health check passes.

## Health checks

- `web` must respond successfully through `app.example.com`
- `server` must return `200` from `/healthz`
- the MCP endpoint must respond at `/mcp`
- `/data/app.db` must exist and be writable by the `server` container

## Rollback procedure

1. Set the previous GHCR image tags in the deploy environment.
2. Pull the previous images.
3. Restart `web`, `server`, and `deploy-hook` with the previous tags.
4. Restore the DB backup only if the failed deploy included a non-reversible migration.

## Backup expectations

- Snapshot `/data/app.db`, `/data/app.db-wal`, and `/data/app.db-shm`
- Take a backup before migrations
- Retain enough history to reverse the most recent bad deploy

## Common failure modes

- `server` cannot open `/data/app.db` because the volume mount or file permissions are wrong
- deploy hook signature mismatch due to a bad shared secret or altered payload
- Caddy routing mismatch between configured hostnames and Cloudflare Tunnel ingress
- DB migrations fail because the target image and schema version drifted apart
- `web` points at the wrong API base URL in production env configuration

## Validation checklist

- GHCR images exist for `web`, `server`, and `deploy-hook`
- the VPS can pull those images
- `/data/app.db` exists after the first migration
- `curl https://api.example.com/healthz` returns success
- MCP requests reach `https://mcp.example.com/mcp`
- a signed deploy webhook request completes end to end

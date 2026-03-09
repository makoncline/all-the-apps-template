# Implementation Plan Summary

This repo is a `pnpm` + `turbo` monorepo with one shared greetings vertical slice across contracts, core logic, DB access, server routes, SDK, and clients.

## Current shape

- Shared contracts live in `packages/contracts`
- Pure use-cases live in `packages/core`
- Drizzle + local libSQL/SQLite access live in `packages/db`
- Hono REST + MCP live in `apps/server`
- Typed HTTP client lives in `packages/sdk`
- Web, mobile, desktop, and CLI clients all depend on the shared SDK
- Production scaffolding lives under `infra/` and `.github/workflows/`

## Local-first design

- Local development uses a SQLite file through the Turso/libSQL client
- No cloud database is required for local development
- `pnpm dev` starts the server and web app; the other clients can be started separately against the same local server
- The Electron app is a thin shell around the web app, and the mobile app uses its own native UI with the same SDK

## Production direction

- Future deployment targets a VPS with GHCR images, Docker Compose, Caddy, Cloudflare Tunnel, and a deploy hook

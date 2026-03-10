# Implementation Plan Summary

This repo is a local-first TypeScript app platform with one shared greetings vertical slice across contracts, core logic, DB access, server routes, SDK, and multiple surfaces.

## Current shape

- `packages/contracts`: transport-safe schemas and DTOs
- `packages/core`: pure business logic with no framework/runtime dependency
- `packages/db`: Drizzle schema, migrations, and local libSQL/SQLite persistence
- `apps/server`: Hono REST API plus MCP transport
- `packages/sdk`: typed HTTP client used by every remote caller
- `apps/web`, `apps/mobile`, `apps/desktop`, `apps/cli`: surface-specific shells over the shared SDK
- `infra/` and `.github/workflows/`: production scaffolding for the VPS deployment path

## Local-first design

- Local development uses a SQLite file through the Turso/libSQL client
- No cloud database is required for local development
- `pnpm dev` starts the server and web app; the other clients can be started separately against the same local server
- The Electron app is a thin shell around the web app, and the mobile app uses its own native UI with the same SDK

## Production direction

- Future deployment targets a VPS with GHCR images, Docker Compose, Caddy, Cloudflare Tunnel, and a deploy hook

# Hello Monorepo

Hello Monorepo is a local-first TypeScript monorepo that shares one application core across web, mobile, desktop, CLI, and MCP surfaces.

## Stack

- `pnpm` workspace + `turbo`
- Strict TypeScript
- Shared packages for contracts, core logic, DB access, SDK, and config
- Server: Hono
- Database: local libSQL/SQLite via the Turso/libSQL client
- ORM + migrations: Drizzle
- Web: Next.js + Tailwind CSS + TanStack Query
- Mobile: Expo + NativeWind + TanStack Query
- Desktop: Electron shell around the web app
- CLI: Node CLI using the shared SDK over HTTP

## Apps and packages

- `packages/contracts`: shared Zod schemas and DTO types
- `packages/core`: framework-free greetings use-cases
- `packages/db`: Drizzle schema, migrations, and libSQL/SQLite repository
- `packages/sdk`: typed HTTP client used by all clients
- `apps/server`: Hono REST API and MCP endpoint
- `apps/web`: Next.js UI
- `apps/mobile`: Expo UI
- `apps/desktop`: Electron shell
- `apps/cli`: Node CLI

## Local development

1. `pnpm install`
2. `pnpm db:generate`
3. `pnpm db:migrate`
4. `pnpm dev`

The default `pnpm dev` workflow starts the server on `http://localhost:3001` and the web app on `http://localhost:3000`.

Other local surfaces:

- `pnpm --filter @hello/cli dev list`
- `pnpm --filter @hello/mobile dev`
- `pnpm --filter @hello/desktop dev`

## Local database

Local development uses a local libSQL/SQLite file. The repo uses the Turso/libSQL client locally and does not require any cloud database service for local development.

- Repo-local development data lives under [`data/`](/Users/makon/dev/test-monorepo/data)
- Commit only [`data/.gitkeep`](/Users/makon/dev/test-monorepo/data/.gitkeep)
- The local DB file is expected at `data/local.db`

## Deployment docs

- Implementation summary: [`docs/implementation-plan.md`](/Users/makon/dev/test-monorepo/docs/implementation-plan.md)
- VPS deployment skill: [`skills/deploy-vps/SKILL.md`](/Users/makon/dev/test-monorepo/skills/deploy-vps/SKILL.md)
- Infra scaffolding: [`infra/docker/compose.prod.yml`](/Users/makon/dev/test-monorepo/infra/docker/compose.prod.yml), [`infra/caddy/Caddyfile`](/Users/makon/dev/test-monorepo/infra/caddy/Caddyfile), [`infra/cloudflared/config.yml`](/Users/makon/dev/test-monorepo/infra/cloudflared/config.yml), [`infra/deploy/deploy-hook.ts`](/Users/makon/dev/test-monorepo/infra/deploy/deploy-hook.ts)

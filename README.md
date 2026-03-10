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

Core bootstrap:

- `pnpm install`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm dev`

`pnpm dev` starts the server and web app.

Surface commands:

- `pnpm server`
- `pnpm web dev|build`
- `pnpm mac dev`
- `pnpm ios dev|dev:device|preview|preview:device|ota:preview`
- `pnpm cli list|health|create --name "..."`

Relevant code paths:

- root command router: [`scripts/run-surface.mjs`](/Users/makon/dev/test-monorepo/scripts/run-surface.mjs)
- root script entrypoints: [`package.json`](/Users/makon/dev/test-monorepo/package.json)
- server routes and MCP wiring: [`apps/server/src/app.ts`](/Users/makon/dev/test-monorepo/apps/server/src/app.ts), [`apps/server/src/mcp/index.ts`](/Users/makon/dev/test-monorepo/apps/server/src/mcp/index.ts)
- iOS variant config and OTA channel wiring: [`apps/mobile/app.config.ts`](/Users/makon/dev/test-monorepo/apps/mobile/app.config.ts)
- iOS package-owned commands: [`apps/mobile/package.json`](/Users/makon/dev/test-monorepo/apps/mobile/package.json)
- Expo project/build metadata: [`apps/mobile/eas.json`](/Users/makon/dev/test-monorepo/apps/mobile/eas.json)
- mobile env shape: [`apps/mobile/.env.example`](/Users/makon/dev/test-monorepo/apps/mobile/.env.example)
- web entrypoints and build config: [`apps/web/src/app/page.tsx`](/Users/makon/dev/test-monorepo/apps/web/src/app/page.tsx), [`apps/web/package.json`](/Users/makon/dev/test-monorepo/apps/web/package.json), [`apps/web/tsconfig.typecheck.json`](/Users/makon/dev/test-monorepo/apps/web/tsconfig.typecheck.json), [`apps/web/eslint.config.mjs`](/Users/makon/dev/test-monorepo/apps/web/eslint.config.mjs)

## Local database

Local development uses a local libSQL/SQLite file. The repo uses the Turso/libSQL client locally and does not require any cloud database service for local development.

- Repo-local development data lives under [`data/`](/Users/makon/dev/test-monorepo/data)
- Commit only [`data/.gitkeep`](/Users/makon/dev/test-monorepo/data/.gitkeep)
- The local DB file is expected at `data/local.db`

## Deployment docs

- Implementation summary: [`docs/implementation-plan.md`](/Users/makon/dev/test-monorepo/docs/implementation-plan.md)
- VPS deployment skill: [`skills/deploy-vps/SKILL.md`](/Users/makon/dev/test-monorepo/skills/deploy-vps/SKILL.md)
- Infra scaffolding: [`infra/docker/compose.prod.yml`](/Users/makon/dev/test-monorepo/infra/docker/compose.prod.yml), [`infra/caddy/Caddyfile`](/Users/makon/dev/test-monorepo/infra/caddy/Caddyfile), [`infra/cloudflared/config.yml`](/Users/makon/dev/test-monorepo/infra/cloudflared/config.yml), [`infra/deploy/deploy-hook.ts`](/Users/makon/dev/test-monorepo/infra/deploy/deploy-hook.ts)

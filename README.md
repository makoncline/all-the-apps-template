# All the Apps Template

A local-first TypeScript monorepo for building one app across web, mobile, desktop, CLI, and MCP. Shared contracts, business logic, DB access, and a typed SDK live in one place; each surface adds only its runtime-specific shell.

The point of this repo is not "all the apps." The point is one durable domain model with many surfaces on top.

## Architecture

```text
packages/contracts  -> transport-safe schemas and DTOs
packages/core       -> pure business logic
packages/db         -> persistence implementation
apps/server         -> HTTP + MCP transport over core/db
packages/sdk        -> typed client for remote callers
apps/*              -> surface-specific UI or runtime glue
```

Current vertical slice:

```text
contracts -> core -> db -> server/mcp -> sdk -> web/mobile/desktop/cli
```

## Boundaries

Use these boundaries to keep the template from drifting:

| Path | Put this here | Keep this out |
| --- | --- | --- |
| `packages/contracts` | Zod schemas, DTOs, transport-safe types | Business logic, DB access, framework code |
| `packages/core` | Pure use-cases and domain rules | HTTP, React, persistence details |
| `packages/db` | Drizzle schema, migrations, repositories, libSQL wiring | UI concerns, transport code |
| `apps/server` | Hono routes, MCP tool registration, container wiring | Client UI logic |
| `packages/sdk` | Typed client transport wrapper for server APIs | UI state, server-only code |
| `apps/web` | Web UI | Shared domain logic duplicated from `packages/core` |
| `apps/mobile` | Native mobile UI | Server or DB implementation details |
| `apps/desktop` | Electron shell around the web app | Separate desktop-only domain layer unless truly required |
| `apps/cli` | Command-line UX | Duplicate API/client logic |

## Support Matrix

| Surface | Status | Notes | Entry command |
| --- | --- | --- | --- |
| Server | First-class | Hono API backed by local libSQL/SQLite | `pnpm server` |
| MCP | First-class | Tool-only MCP surface exposed by the server | `pnpm server` |
| Web | First-class | Next.js app calling the server through the shared SDK | `pnpm web dev` |
| iOS | First-class | Expo native UI over the shared SDK | `pnpm ios dev` |
| Desktop | Supported | Electron shell around the web app, not a separate UI stack | `pnpm mac dev` |
| CLI | Supported | Node CLI using the shared SDK over HTTP | `pnpm cli list` |
| Android | Partial | Expo command exists, but root command routing/docs are iOS-first today | `pnpm --filter @hello/mobile android` |

## Local Development

Bootstrap:

- `pnpm install`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm dev`

`pnpm dev` starts the server and web app. Other surfaces run against the same local server.

Common commands:

- `pnpm server`
- `pnpm web dev|build`
- `pnpm mac dev`
- `pnpm ios dev|dev:device|preview|preview:device|ota:preview`
- `pnpm cli list|health|create --name "..."`

## Why Local-First

- Local development uses libSQL/SQLite through the Turso/libSQL client.
- No cloud database is required for local development.
- Repo-local data lives under [`data/`](data/); commit only [`data/.gitkeep`](data/.gitkeep).
- The default local DB file is `data/local.db`.

## Code Map

- Root command router: [`scripts/run-surface.mjs`](scripts/run-surface.mjs)
- Root scripts: [`package.json`](package.json)
- Implementation summary: [`docs/implementation-plan.md`](docs/implementation-plan.md)
- Contracts: [`packages/contracts`](packages/contracts)
- Core logic: [`packages/core`](packages/core)
- DB layer: [`packages/db`](packages/db)
- SDK: [`packages/sdk`](packages/sdk)
- Server entrypoints: [`apps/server/src/app.ts`](apps/server/src/app.ts), [`apps/server/src/mcp/index.ts`](apps/server/src/mcp/index.ts)
- Web app: [`apps/web`](apps/web)
- Mobile config: [`apps/mobile/app.config.ts`](apps/mobile/app.config.ts), [`apps/mobile/package.json`](apps/mobile/package.json)
- Desktop shell: [`apps/desktop`](apps/desktop)
- CLI: [`apps/cli`](apps/cli)
- Infra: [`infra/docker/compose.prod.yml`](infra/docker/compose.prod.yml), [`infra/caddy/Caddyfile`](infra/caddy/Caddyfile), [`infra/cloudflared/config.yml`](infra/cloudflared/config.yml), [`infra/deploy/deploy-hook.ts`](infra/deploy/deploy-hook.ts)

## Production Direction

The production path is a VPS-oriented deployment story, not just a local demo:

- GHCR-built images via GitHub Actions
- Docker Compose under [`infra/docker/compose.prod.yml`](infra/docker/compose.prod.yml)
- Caddy for edge routing
- Cloudflare Tunnel support
- Deploy hook scaffolding under [`infra/deploy`](infra/deploy)

## Template Notes

- Desktop is intentionally a packaged web surface. If you need a truly separate desktop UI, treat that as a new surface, not a claim the template already makes.
- This repo is designed so you can delete surfaces you do not need and keep the shared packages intact.
- If you make a reusable improvement to the template, file it upstream: `https://github.com/makoncline/all-the-apps-template/issues/new`

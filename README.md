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

Shortcut commands from the repo root:

- `pnpm server`
- `pnpm web dev`
- `pnpm web build`
- `pnpm mac dev`
- `pnpm ios dev`
- `pnpm ios dev:device`
- `pnpm ios preview`
- `pnpm ios preview:device`
- `pnpm ios ota:preview`
- `pnpm cli list`
- `pnpm cli health`
- `pnpm cli create --name "Makon"`

### iPhone local builds

If you want the real app on a physical iPhone, use local builds instead of Expo Go.

1. Connect the iPhone to your Mac, trust the computer, and make sure Xcode can see the device.
2. Start the server on your Mac.
3. Use your Mac LAN IP for [`apps/mobile/.env.example`](/Users/makon/dev/test-monorepo/apps/mobile/.env.example), for example `EXPO_PUBLIC_SERVER_BASE_URL=http://192.168.0.70:3001`.
4. Build and install the development client onto the device:
   - `pnpm ios dev:device`
5. After the native app is installed once, start Metro for the dev client:
   - `EXPO_PUBLIC_SERVER_BASE_URL=http://YOUR_MAC_LAN_IP:3001 pnpm --filter @hello/mobile dev:lan`

Notes:

- This repo uses Expo Continuous Native Generation for local native builds. The generated [`apps/mobile/ios`](/Users/makon/dev/test-monorepo/apps/mobile/ios) and [`apps/mobile/android`](/Users/makon/dev/test-monorepo/apps/mobile/android) folders are intentionally ignored.
- Expo Go is fine for quick UI checks, but the intended on-device workflow is the local development build path above.

### iPhone preview build with OTA updates

For a standalone build that works away from your Mac, use the preview variant.

1. Sign in to Expo once:
   - `pnpm --filter @hello/mobile exec eas login`
2. Initialize the Expo project once:
   - `pnpm --filter @hello/mobile exec eas project:init`
   If `eas project:init` reports that it cannot write into dynamic config, copy the project ID into `EAS_PROJECT_ID`. This repo already has the current project ID wired in [`apps/mobile/app.config.ts`](/Users/makon/dev/test-monorepo/apps/mobile/app.config.ts) and [`apps/mobile/.env.example`](/Users/makon/dev/test-monorepo/apps/mobile/.env.example).
3. Install the preview build directly onto your iPhone:
   - `EXPO_PUBLIC_SERVER_BASE_URL=http://YOUR_TAILSCALE_OR_PUBLIC_SERVER EAS_PROJECT_ID=your-project-id pnpm ios preview:device`
4. Publish JS and asset updates to that installed preview app:
   - `EXPO_PUBLIC_SERVER_BASE_URL=http://YOUR_TAILSCALE_OR_PUBLIC_SERVER EAS_PROJECT_ID=your-project-id pnpm ios ota:preview --message "Describe the change"`

Notes:

- The preview build uses a separate bundle identifier from the development build, so both can live on the same device.
- The preview build is a Release configuration and does not depend on Metro running on your Mac.
- OTA updates apply to JS and assets. Native dependency or config changes still require rebuilding the preview app.
- If your app talks to a server, you can point it at a Tailscale address and keep using your Mac-hosted backend outside your home Wi-Fi.

## Local database

Local development uses a local libSQL/SQLite file. The repo uses the Turso/libSQL client locally and does not require any cloud database service for local development.

- Repo-local development data lives under [`data/`](/Users/makon/dev/test-monorepo/data)
- Commit only [`data/.gitkeep`](/Users/makon/dev/test-monorepo/data/.gitkeep)
- The local DB file is expected at `data/local.db`

## Deployment docs

- Implementation summary: [`docs/implementation-plan.md`](/Users/makon/dev/test-monorepo/docs/implementation-plan.md)
- VPS deployment skill: [`skills/deploy-vps/SKILL.md`](/Users/makon/dev/test-monorepo/skills/deploy-vps/SKILL.md)
- Infra scaffolding: [`infra/docker/compose.prod.yml`](/Users/makon/dev/test-monorepo/infra/docker/compose.prod.yml), [`infra/caddy/Caddyfile`](/Users/makon/dev/test-monorepo/infra/caddy/Caddyfile), [`infra/cloudflared/config.yml`](/Users/makon/dev/test-monorepo/infra/cloudflared/config.yml), [`infra/deploy/deploy-hook.ts`](/Users/makon/dev/test-monorepo/infra/deploy/deploy-hook.ts)

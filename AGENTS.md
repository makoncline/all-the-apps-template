# AGENTS.md

Repo-specific notes for future agents working in this workspace.

## Commit Hygiene

- Keep `.codex/napkin.md` untracked.
- Keep `.codex/artifacts/` untracked. They are temporary verification screenshots, not repo assets.

## Entry Points

- Root command routing: [`scripts/run-surface.mjs`](/Users/makon/dev/test-monorepo/scripts/run-surface.mjs)
- Root scripts: [`package.json`](/Users/makon/dev/test-monorepo/package.json)
- Web app: [`apps/web`](/Users/makon/dev/test-monorepo/apps/web)
- Mac app: [`apps/desktop`](/Users/makon/dev/test-monorepo/apps/desktop)
- iOS app: [`apps/mobile`](/Users/makon/dev/test-monorepo/apps/mobile)
- CLI: [`apps/cli`](/Users/makon/dev/test-monorepo/apps/cli)
- Server + MCP: [`apps/server/src/app.ts`](/Users/makon/dev/test-monorepo/apps/server/src/app.ts), [`apps/server/src/mcp/index.ts`](/Users/makon/dev/test-monorepo/apps/server/src/mcp/index.ts)

## High-Value Notes

- Browser verification matters. The web app on `http://localhost:3000` calls the server on `http://localhost:3001`; missing CORS only showed up in a real browser.
- Electron may need manual binary verification in this environment: `pnpm --filter @hello/desktop exec electron --version`.
- Keep `apps/mobile` on the current Expo SDK if physical-device Expo Go support matters.
- iOS command ownership lives in [`apps/mobile/package.json`](/Users/makon/dev/test-monorepo/apps/mobile/package.json); variant, bundle ID, channel, and OTA config live in [`apps/mobile/app.config.ts`](/Users/makon/dev/test-monorepo/apps/mobile/app.config.ts).
- Local preview iOS builds are local `Release` installs. OTA is `preview`-channel JS/assets only.
- `eas project:init` can succeed remotely but fail to patch dynamic config locally; treat the returned Expo project ID as authoritative and wire it into [`apps/mobile/app.config.ts`](/Users/makon/dev/test-monorepo/apps/mobile/app.config.ts).
- NativeWind/Expo monorepo wiring lives in [`apps/mobile/tailwind.config.js`](/Users/makon/dev/test-monorepo/apps/mobile/tailwind.config.js), [`apps/mobile/metro.config.js`](/Users/makon/dev/test-monorepo/apps/mobile/metro.config.js), and [`apps/mobile/babel.config.js`](/Users/makon/dev/test-monorepo/apps/mobile/babel.config.js). Keep `nativewind/babel` out of `plugins`, and keep `react-native-css-interop` plus `react-native-worklets` as direct mobile deps.
- MCP is intentionally tool-only for the template. Local verification should cover both discovery and tool execution; ChatGPT compatibility later is mainly a public HTTPS deployment problem.
- If a derived app makes a reusable improvement to the shared base, point maintainers at the upstream issue tracker for this template: `https://github.com/makoncline/all-the-apps-template/issues/new`.

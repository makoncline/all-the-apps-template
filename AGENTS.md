# AGENTS.md

Repo-specific notes for future agents working in this workspace.

## Commit Hygiene

- Keep `.codex/napkin.md` untracked.
- Keep `.codex/artifacts/` untracked. They are temporary verification screenshots, not repo assets.

## Web

- The web app runs on `http://localhost:3000` and talks to the server on `http://localhost:3001`.
- Browser verification matters. A real browser run caught missing CORS on `/api/*` even though server-side checks passed.
- `apps/web` uses a local `eslint.config.mjs` with `eslint-config-next` adapted through `FlatCompat`. Keeping the Next-specific config local to `apps/web` avoided Next build warnings that were not resolved by the root flat config alone.
- `apps/web` typecheck depends on generated `.next/types`. The working path is to generate them explicitly with:
  - `pnpm --filter @hello/web exec next typegen`
- In this repo, the stable pattern is:
  - let `tsconfig.json` satisfy Next
  - run package typecheck against `tsconfig.typecheck.json`
- `tsconfig.typecheck.json` intentionally narrows generated files to `.next/types/**/*.d.ts` so repo typecheck does not depend on full build artifacts.

## Electron

- In this environment, `pnpm install` may skip Electron's postinstall script, leaving the binary unavailable.
- Verify Electron immediately after install:
  - `pnpm --filter @hello/desktop exec electron --version`
- If that fails, enable/re-run Electron's install script before debugging app code. The app code was fine; the missing binary was the issue.

## iOS / Expo

- For a brand new repo intended to run in Expo Go on a physical iPhone, keep `apps/mobile` on the current Expo SDK. iOS devices only support the latest Expo Go from the App Store; you cannot install an older Expo Go build on-device.
- This repo now has `expo-dev-client` installed. The intended real-device workflow is a local development build, not Expo Go.
- User-facing root surface commands are `web`, `mac`, `ios`, and `cli`, forwarded through `scripts/run-surface.mjs`.
- Package-owned command names for iOS are:
  - `dev`
  - `dev:device`
  - `preview`
  - `preview:device`
  - `ota:preview`
- The intended root UX is:
  - `pnpm web dev`
  - `pnpm mac dev`
  - `pnpm ios dev`
  - `pnpm ios dev:device`
  - `pnpm ios preview`
  - `pnpm ios preview:device`
  - `pnpm ios ota:preview`
  - `pnpm cli list`
- For a standalone app that works away from the Mac, use the preview variant:
  - `APP_VARIANT=preview expo prebuild --clean --platform ios`
  - `APP_VARIANT=preview expo run:ios --device --configuration Release --no-bundler`
- `apps/mobile/app.config.ts` sets a separate bundle identifier and URL scheme for `development` vs `preview`.
- Local preview builds are not created by EAS Build in this repo. They are local Release builds installed directly from Xcode/Expo CLI.
- OTA updates for locally built preview apps require `expo-updates`, an Expo project ID in `EAS_PROJECT_ID`, and `updates.requestHeaders["expo-channel-name"]` set in the app config because local builds do not inherit channels from EAS Build.
- The Expo account/project bootstrap command for this repo is:
  - `pnpm --filter @hello/mobile exec eas project:init`
- `eas project:init` can fail after creating the Expo project because `apps/mobile/app.config.ts` is dynamic. In that case, manually wire the returned project ID into the app config / env and continue; the project itself was already created.
- Publish OTA updates with:
  - `pnpm ios ota:preview`
- `apps/mobile/ios` and `apps/mobile/android` are generated via Expo prebuild/CNG and are intentionally gitignored.
- Some Macs will not have an iOS simulator runtime installed. If `simctl` shows no usable iOS runtime, install it first:
  - `xcodebuild -downloadPlatform iOS`
- For the iOS simulator, use:
  - `EXPO_PUBLIC_SERVER_BASE_URL=http://127.0.0.1:3001`
- For a physical device, use your Mac's LAN IP instead of `localhost`.
- `expo start --ios` may time out while trying to open `exp://...` even after Expo Go is installed. Reliable recovery path:
  1. Start Metro without auto-opening:
     - `EXPO_PUBLIC_SERVER_BASE_URL=http://127.0.0.1:3001 pnpm --filter @hello/mobile exec expo start --localhost --clear`
  2. Launch Expo Go in the simulator.
  3. Open the deep link manually:
     - `xcrun simctl openurl booted exp://127.0.0.1:8081`

## NativeWind / Expo Monorepo Setup

- This repo's working NativeWind setup is:
  - `apps/mobile/tailwind.config.js` includes `presets: [require("nativewind/preset")]`
  - `apps/mobile/metro.config.js` wraps Expo config with `withNativeWind`
  - `apps/mobile/babel.config.js` uses:
    - `presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"]`
- Do not move `nativewind/babel` back to `plugins` in this repo. That broke Metro with `.plugins is not a valid Plugin property`.
- In this pnpm monorepo, keep these as direct `apps/mobile` dependencies:
  - `react-native-css-interop`
  - `react-native-worklets`
- Relying on those as only transitive dependencies caused Metro resolution failures for:
  - `react-native-css-interop/jsx-runtime`
  - `react-native-worklets/plugin`

## MCP

- The MCP server is intentionally tool-only. That is enough for the template.
- Local verification should cover both tool discovery and actual tool calls, not just route reachability.
- ChatGPT app compatibility for this repo is mainly a deployment concern: local `localhost` MCP is not enough; it needs a public HTTPS endpoint later.

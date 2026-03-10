import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  checkGeneratedArtifacts,
  generateDesktopThemeTs,
  generateNativeThemeCss,
  generateNativeThemeTs,
  generateWebThemeCss,
  writeGeneratedArtifacts
} from "../src";
import { THEME_TOKENS } from "../src";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories
      .splice(0)
      .map(async (directory) => rm(directory, { force: true, recursive: true }))
  );
});

const createRepoRoot = async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "ui-tokens-"));
  tempDirectories.push(directory);

  await mkdir(path.join(directory, "apps/web/src/app"), { recursive: true });
  await mkdir(path.join(directory, "apps/mobile/src/lib"), { recursive: true });
  await mkdir(path.join(directory, "apps/desktop/src/generated"), {
    recursive: true
  });

  return directory;
};

describe("@hello/ui-tokens generation", () => {
  it("defines every required semantic token in both theme modes", () => {
    expect(Object.keys(THEME_TOKENS.light.colors)).toEqual(
      Object.keys(THEME_TOKENS.dark.colors)
    );
    expect(THEME_TOKENS.light.colors.background).toBeTruthy();
    expect(THEME_TOKENS.dark.colors.ring).toBeTruthy();
  });

  it("generates the expected web and native theme artifacts", () => {
    const webCss = generateWebThemeCss();
    const nativeCss = generateNativeThemeCss();
    const nativeThemeTs = generateNativeThemeTs();
    const desktopThemeTs = generateDesktopThemeTs();

    expect(webCss).toContain(":root");
    expect(webCss).toContain(".dark");
    expect(webCss).toContain("@theme inline");

    expect(nativeCss).toContain(":root");
    expect(nativeCss).toContain(".dark:root");
    expect(nativeCss).toContain("@tailwind utilities;");

    expect(nativeThemeTs).toContain("export const THEME");
    expect(nativeThemeTs).toContain('"background"');
    expect(nativeThemeTs).toContain("export const NAV_THEME");

    expect(desktopThemeTs).toContain("desktopWindowBackground");
  });

  it("detects drift and passes after syncing generated artifacts", async () => {
    const repoRoot = await createRepoRoot();
    const webThemePath = path.join(repoRoot, "apps/web/src/app/theme.css");

    await expect(checkGeneratedArtifacts(repoRoot)).rejects.toThrow(/missing/i);

    await writeGeneratedArtifacts(repoRoot);

    await expect(checkGeneratedArtifacts(repoRoot)).resolves.toBeUndefined();

    await writeFile(webThemePath, "stale\n", "utf8");

    await expect(checkGeneratedArtifacts(repoRoot)).rejects.toThrow(
      /out of date/i
    );

    await writeGeneratedArtifacts(repoRoot);

    await expect(checkGeneratedArtifacts(repoRoot)).resolves.toBeUndefined();
  });
});

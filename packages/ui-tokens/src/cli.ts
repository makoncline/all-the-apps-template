import process from "node:process";

import {
  checkGeneratedArtifacts,
  resolveRepoRoot,
  writeGeneratedArtifacts
} from "./generate";

const run = async () => {
  const command = process.argv[2];
  const repoRoot = resolveRepoRoot();

  if (command === "sync") {
    await writeGeneratedArtifacts(repoRoot);
    return;
  }

  if (command === "check") {
    await checkGeneratedArtifacts(repoRoot);
    return;
  }

  throw new Error(
    `Unknown @hello/ui-tokens command: ${command ?? "(missing)"}`
  );
};

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

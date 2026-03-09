import { spawn } from "node:child_process";

const [, , surface, ...args] = process.argv;

const surfaceMap = {
  web: {
    pkg: "@hello/web",
    defaultCommand: "dev"
  },
  mac: {
    pkg: "@hello/desktop",
    defaultCommand: "dev"
  },
  ios: {
    pkg: "@hello/mobile",
    defaultCommand: "dev"
  },
  cli: {
    pkg: "@hello/cli",
    defaultCommand: null
  }
};

const target = surfaceMap[surface];

if (!target) {
  console.error(`Unknown surface "${surface}". Expected one of: ${Object.keys(surfaceMap).join(", ")}`);
  process.exit(1);
}

const [command, ...commandArgs] =
  args.length > 0 ? args : target.defaultCommand ? [target.defaultCommand] : [];

if (!command) {
  console.error(`Missing command for "${surface}".`);
  process.exit(1);
}

const child = spawn(
  "pnpm",
  ["--filter", target.pkg, "run", command, ...commandArgs],
  {
    stdio: "inherit",
    shell: process.platform === "win32"
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "drizzle-kit";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const workspaceRoot = path.resolve(currentDirectory, "../..");

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? `file:${path.join(workspaceRoot, "data/local.db")}`
  }
});

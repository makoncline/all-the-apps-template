import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { migrate } from "drizzle-orm/libsql/migrator";

import { createDatabaseClient } from "./client";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), "apps/server/.env"), override: false });

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const migrationsFolder = path.resolve(currentDirectory, "../drizzle/migrations");

const main = async () => {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./data/local.db";
  const { db, client } = await createDatabaseClient({
    url: databaseUrl
  });

  await migrate(db, { migrationsFolder });
  await client.close();
};

main().catch((error: unknown) => {
  console.error("Database migration failed.", error);
  process.exitCode = 1;
});

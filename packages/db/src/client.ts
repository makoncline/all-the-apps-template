import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const workspaceRoot = path.resolve(currentDirectory, "../../..");

export interface DatabaseClientOptions {
  url: string;
  authToken?: string;
}

export const resolveDatabaseUrl = (databaseUrl: string): string => {
  if (!databaseUrl.startsWith("file:")) {
    return databaseUrl;
  }

  const fileTarget = databaseUrl.slice("file:".length);

  if (path.isAbsolute(fileTarget)) {
    return `file:${fileTarget}`;
  }

  return `file:${path.resolve(workspaceRoot, fileTarget)}`;
};

const ensureParentDirectory = (resolvedUrl: string): void => {
  if (!resolvedUrl.startsWith("file:")) {
    return;
  }

  const filePath = resolvedUrl.slice("file:".length);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
};

export const createDatabaseClient = async (options: DatabaseClientOptions) => {
  const url = resolveDatabaseUrl(options.url);
  ensureParentDirectory(url);

  const client = createClient({
    url,
    authToken: options.authToken
  });

  await client.execute("SELECT 1");
  await client.execute("PRAGMA journal_mode = WAL");

  const db = drizzle(client, { schema });

  return {
    client,
    db,
    url
  };
};

export type DatabaseClient = Awaited<ReturnType<typeof createDatabaseClient>>;

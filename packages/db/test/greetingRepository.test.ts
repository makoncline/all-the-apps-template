import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createDatabaseClient } from "../src/client";
import { DrizzleGreetingRepository } from "../src/repositories/DrizzleGreetingRepository";

const tempPaths: string[] = [];

afterEach(() => {
  for (const target of tempPaths.splice(0)) {
    fs.rmSync(path.dirname(target), { recursive: true, force: true });
  }
});

describe("DrizzleGreetingRepository", () => {
  it("persists and lists greetings from a local sqlite file", async () => {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "hello-db-"));
    const databaseFile = path.join(tempDirectory, "test.db");
    tempPaths.push(databaseFile);

    const { db, client } = await createDatabaseClient({
      url: `file:${databaseFile}`
    });

    await db.run(
      `
        CREATE TABLE greetings (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `
    );

    const repository = new DrizzleGreetingRepository(db);

    await repository.create({
      id: crypto.randomUUID(),
      name: "Makon",
      message: "Hello, Makon!",
      createdAt: new Date("2026-03-09T00:00:00.000Z").toISOString()
    });

    const greetings = await repository.list();

    expect(greetings).toHaveLength(1);
    expect(greetings[0]?.name).toBe("Makon");

    await client.close();
  });
});

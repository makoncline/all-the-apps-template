import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app";
import { createContainer } from "../src/lib/container";

const cleanupDirectories: string[] = [];

afterEach(() => {
  for (const directory of cleanupDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("server routes", () => {
  let app: ReturnType<typeof createApp>;
  let close: () => void;

  beforeEach(async () => {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "hello-server-"));
    cleanupDirectories.push(tempDirectory);

    const container = await createContainer({
      PORT: 3001,
      DATABASE_URL: `file:${path.join(tempDirectory, "test.db")}`,
      NODE_ENV: "test"
    });

    await container.database.client.execute(`
      CREATE TABLE greetings (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    app = createApp(container);
    close = () => container.database.client.close();
  });

  afterEach(() => {
    close();
  });

  it("returns health information", async () => {
    const response = await app.request("/healthz");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      service: "hello-server"
    });
  });

  it("creates and lists greetings", async () => {
    const createResponse = await app.request("/api/greetings", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ name: "Makon" })
    });

    expect(createResponse.status).toBe(201);

    const listResponse = await app.request("/api/greetings");
    const payload = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(payload.greetings).toHaveLength(1);
    expect(payload.greetings[0]?.message).toBe("Hello, Makon!");
  });

  it("returns a predictable error for invalid input", async () => {
    const response = await app.request("/api/greetings", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ name: "   " })
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "INVALID_GREETING_NAME"
      }
    });
  });
});

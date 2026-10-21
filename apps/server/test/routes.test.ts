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

  it("executes an MCP tool with a normal request", async () => {
    const response = await app.request("/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream"
      },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1, method: "tools/call",
        params: { name: "create_greeting", arguments: { name: "Makon" } }
      })
    });
    const text = await response.text();
    const payload = JSON.parse(text.match(/^data: (.+)$/m)?.[1] ?? text);
    expect(response.status).toBe(200);
    expect(payload.result.isError).not.toBe(true);
    expect(JSON.stringify(payload.result)).toContain("Hello, Makon!");
  });

  it("rejects oversized MCP bodies and excessive argument structure", async () => {
    const headers = {
      "content-type": "application/json",
      accept: "application/json, text/event-stream"
    };
    const tooLarge = await app.request("/mcp", {
      method: "POST", headers,
      body: JSON.stringify({ padding: "x".repeat(65 * 1024) })
    });
    expect(tooLarge.status).toBe(413);

    const tooMany = await app.request("/mcp", {
      method: "POST", headers,
      body: JSON.stringify({
        jsonrpc: "2.0", id: 2, method: "tools/call",
        params: { name: "create_greeting", arguments: { name: "Makon", extra: Array(1_001).fill(null) } }
      })
    });
    const text = await tooMany.text();
    const payload = JSON.parse(text.match(/^data: (.+)$/m)?.[1] ?? text);
    expect(payload.result.isError).toBe(true);
    expect(JSON.stringify(payload.result)).toMatch(/limit|complex|elements/i);
  });

});

import { afterEach, describe, expect, it, vi } from "vitest";

import { createGreeting, listGreetings } from "../src";
import type { ApiError } from "../src";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("sdk", () => {
  it("parses successful responses with shared schemas", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        greetings: [
          {
            id: "5dbad256-a217-4ddd-9b0b-cc55c6a906c6",
            name: "Makon",
            message: "Hello, Makon!",
            createdAt: "2026-03-09T00:00:00.000Z"
          }
        ]
      })
    }) as typeof fetch;

    const response = await listGreetings("http://localhost:3001");

    expect(response.greetings).toHaveLength(1);
  });

  it("surfaces non-ok responses as ApiError", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          message: "Name must not be empty."
        }
      })
    }) as typeof fetch;

    await expect(createGreeting({ name: "   " }, "http://localhost:3001")).rejects.toMatchObject({
      name: "ApiError",
      status: 400
    } satisfies Partial<ApiError>);
  });
});

import { describe, expect, it } from "vitest";

import { DomainError, createGreeting, listGreetings } from "../src";
import type { GreetingRecord, GreetingRepository } from "../src";

const createRepository = (): GreetingRepository => {
  const greetings: GreetingRecord[] = [];

  return {
    async create(greeting) {
      greetings.push(greeting);
      return greeting;
    },
    async list() {
      return [...greetings];
    }
  };
};

describe("greetings use-cases", () => {
  it("creates a greeting with trimmed name and generated message", async () => {
    const repository = createRepository();
    const execute = createGreeting(repository);

    const greeting = await execute({ name: "  Makon  " });

    expect(greeting.name).toBe("Makon");
    expect(greeting.message).toBe("Hello, Makon!");
    expect(greeting.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("rejects empty names after trimming", async () => {
    const repository = createRepository();
    const execute = createGreeting(repository);

    await expect(execute({ name: "   " })).rejects.toBeInstanceOf(DomainError);
  });

  it("lists greetings from the repository", async () => {
    const repository = createRepository();
    const create = createGreeting(repository);
    const list = listGreetings(repository);

    await create({ name: "Makon" });

    const response = await list();

    expect(response.greetings).toHaveLength(1);
    expect(response.greetings[0]?.message).toBe("Hello, Makon!");
  });
});

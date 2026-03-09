import type { CreateGreetingInput, CreateGreetingOutput } from "@hello/contracts";

import { DomainError } from "../errors";
import type { GreetingRepository } from "../ports/GreetingRepository";

export type CreateGreeting = (input: CreateGreetingInput) => Promise<CreateGreetingOutput>;

export const createGreeting =
  (repository: GreetingRepository): CreateGreeting =>
  async (input) => {
    const name = input.name.trim();

    if (!name) {
      throw new DomainError("Name must not be empty.", "INVALID_GREETING_NAME");
    }

    const greeting = {
      id: crypto.randomUUID(),
      name,
      message: `Hello, ${name}!`,
      createdAt: new Date().toISOString()
    };

    return repository.create(greeting);
  };

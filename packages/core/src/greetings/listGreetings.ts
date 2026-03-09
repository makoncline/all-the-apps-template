import type { ListGreetingsOutput } from "@hello/contracts";

import type { GreetingRepository } from "../ports/GreetingRepository";

export type ListGreetings = () => Promise<ListGreetingsOutput>;

export const listGreetings =
  (repository: GreetingRepository): ListGreetings =>
  async () => ({
    greetings: await repository.list()
  });

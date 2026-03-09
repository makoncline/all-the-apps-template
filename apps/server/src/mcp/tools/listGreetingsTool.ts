import { ListGreetingsOutputSchema } from "@hello/contracts";

import type { AppContainer } from "../../lib/container";

export const listGreetingsToolDefinition = (container: AppContainer) => {
  const name = "list_greetings";
  const description = "List greetings stored in the local database.";

  return {
    name,
    description,
    outputSchema: ListGreetingsOutputSchema,
    execute: async () => ListGreetingsOutputSchema.parse(await container.listGreetings())
  };
};

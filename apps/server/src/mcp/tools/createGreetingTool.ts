import { CreateGreetingInputSchema, CreateGreetingOutputSchema } from "@hello/contracts";

import type { AppContainer } from "../../lib/container";

export const createGreetingToolDefinition = (container: AppContainer) => {
  const name = "create_greeting";
  const description = "Create a greeting for the provided name.";

  return {
    name,
    description,
    inputSchema: CreateGreetingInputSchema,
    outputSchema: CreateGreetingOutputSchema,
    execute: async (input: unknown) => {
      const parsedInput = CreateGreetingInputSchema.parse(input);
      return CreateGreetingOutputSchema.parse(await container.createGreeting(parsedInput));
    }
  };
};

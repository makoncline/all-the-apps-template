import { createGreeting } from "@hello/sdk";

import { writeOutput } from "../lib/output";

interface CreateCommandOptions {
  json?: boolean;
}

const getBaseUrl = () => process.env.SERVER_BASE_URL ?? "http://localhost:3001";

export const runCreateGreetingCommand = async (
  name: string,
  options: CreateCommandOptions
): Promise<void> => {
  const greeting = await createGreeting({ name }, getBaseUrl());

  if (options.json) {
    writeOutput(greeting, true);
    return;
  }

  writeOutput(`${greeting.message} (${greeting.id})`, false);
};

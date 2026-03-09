import { listGreetings } from "@hello/sdk";

import { writeOutput } from "../lib/output";

interface ListCommandOptions {
  json?: boolean;
}

const getBaseUrl = () => process.env.SERVER_BASE_URL ?? "http://localhost:3001";

export const runListGreetingsCommand = async (options: ListCommandOptions): Promise<void> => {
  const payload = await listGreetings(getBaseUrl());

  if (options.json) {
    writeOutput(payload, true);
    return;
  }

  if (payload.greetings.length === 0) {
    writeOutput("No greetings found.", false);
    return;
  }

  writeOutput(
    payload.greetings
      .map((greeting) => `${greeting.message} [${greeting.id}] ${greeting.createdAt}`)
      .join("\n"),
    false
  );
};

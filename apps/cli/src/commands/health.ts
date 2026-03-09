import { getHealth } from "@hello/sdk";

import { writeOutput } from "../lib/output";

interface HealthCommandOptions {
  json?: boolean;
}

const getBaseUrl = () => process.env.SERVER_BASE_URL ?? "http://localhost:3001";

export const runHealthCommand = async (options: HealthCommandOptions): Promise<void> => {
  const payload = await getHealth(getBaseUrl());
  writeOutput(options.json ? payload : `${payload.service}: ok at ${payload.timestamp}`, !!options.json);
};

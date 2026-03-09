import {
  CreateGreetingInputSchema,
  CreateGreetingOutputSchema,
  HealthcheckOutputSchema,
  ListGreetingsOutputSchema
} from "@hello/contracts";

import type {
  CreateGreetingInput,
  CreateGreetingOutput,
  HealthcheckOutput,
  ListGreetingsOutput
} from "@hello/contracts";

import { request } from "./client";

export const listGreetings = (baseUrl?: string): Promise<ListGreetingsOutput> =>
  request<undefined, ListGreetingsOutput>({
    baseUrl,
    path: "/api/greetings",
    schema: ListGreetingsOutputSchema
  });

export const createGreeting = (
  input: CreateGreetingInput,
  baseUrl?: string
): Promise<CreateGreetingOutput> => {
  const parsedInput = CreateGreetingInputSchema.parse(input);

  return request<CreateGreetingInput, CreateGreetingOutput>({
    baseUrl,
    path: "/api/greetings",
    method: "POST",
    body: parsedInput,
    schema: CreateGreetingOutputSchema
  });
};

export const getHealth = (baseUrl?: string): Promise<HealthcheckOutput> =>
  request<undefined, HealthcheckOutput>({
    baseUrl,
    path: "/healthz",
    schema: HealthcheckOutputSchema
  });

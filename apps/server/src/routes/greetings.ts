import { Hono } from "hono";

import {
  CreateGreetingInputSchema,
  CreateGreetingOutputSchema,
  ListGreetingsOutputSchema
} from "@hello/contracts";

import type { AppContainer } from "../lib/container";

export const createGreetingRoutes = (container: AppContainer) =>
  new Hono()
    .get("/", async (c) => {
      const payload = await container.listGreetings();
      const response = ListGreetingsOutputSchema.parse(payload);
      return c.json(response);
    })
    .post("/", async (c) => {
      const rawInput = await c.req.json();
      const input = CreateGreetingInputSchema.parse(rawInput);
      const payload = await container.createGreeting(input);
      const response = CreateGreetingOutputSchema.parse(payload);
      return c.json(response, 201);
    });

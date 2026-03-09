import { Hono } from "hono";

import { HealthcheckOutputSchema } from "@hello/contracts";

export const healthRoutes = new Hono().get("/", (c) => {
  const payload = HealthcheckOutputSchema.parse({
    ok: true,
    service: "hello-server",
    timestamp: new Date().toISOString()
  });

  return c.json(payload);
});

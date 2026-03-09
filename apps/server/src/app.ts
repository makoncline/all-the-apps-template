import { Hono } from "hono";
import { cors } from "hono/cors";
import { ZodError } from "zod";

import { DomainError } from "@hello/core";

import type { AppContainer } from "./lib/container";
import { createMcpRoutes } from "./mcp";
import { createGreetingRoutes } from "./routes/greetings";
import { healthRoutes } from "./routes/health";

export const createApp = (container: AppContainer) => {
  const app = new Hono();

  app.use(
    "/api/*",
    cors({
      origin: "http://localhost:3000",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"]
    })
  );

  app.onError((error, c) => {
    if (error instanceof ZodError) {
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            issues: error.issues
          }
        },
        400
      );
    }

    if (error instanceof DomainError) {
      return c.json(
        {
          error: {
            code: error.code,
            message: error.message
          }
        },
        400
      );
    }

    console.error(error);

    return c.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected server error."
        }
      },
      500
    );
  });

  app.route("/healthz", healthRoutes);
  app.route("/api/greetings", createGreetingRoutes(container));
  app.route("/mcp", createMcpRoutes(container));

  return app;
};

import { Hono } from "hono";
import { cors } from "hono/cors";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import type { AppContainer } from "../lib/container";
import { createGreetingToolDefinition } from "./tools/createGreetingTool";
import { listGreetingsToolDefinition } from "./tools/listGreetingsTool";

export const createMcpRoutes = (container: AppContainer) => {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Last-Event-ID", "mcp-protocol-version"],
      exposeHeaders: ["mcp-protocol-version"]
    })
  );

  app.all("/", async (c) => {
    const server = new McpServer({
      name: "all-the-apps-template-mcp",
      version: "0.0.0"
    });

    const createGreetingTool = createGreetingToolDefinition(container);
    const listGreetingsTool = listGreetingsToolDefinition(container);

    server.registerTool(
      createGreetingTool.name,
      {
        title: "Create Greeting",
        description: createGreetingTool.description,
        inputSchema: createGreetingTool.inputSchema,
        outputSchema: createGreetingTool.outputSchema
      },
      async (input) => {
        const output = await createGreetingTool.execute(input);

        return {
          structuredContent: output,
          content: [{ type: "text", text: JSON.stringify(output) }]
        };
      }
    );

    server.registerTool(
      listGreetingsTool.name,
      {
        title: "List Greetings",
        description: listGreetingsTool.description,
        outputSchema: listGreetingsTool.outputSchema
      },
      async () => {
        const output = await listGreetingsTool.execute();

        return {
          structuredContent: output,
          content: [{ type: "text", text: JSON.stringify(output) }]
        };
      }
    );

    const transport = new WebStandardStreamableHTTPServerTransport();
    await server.connect(transport);

    return transport.handleRequest(c.req.raw);
  });

  return app;
};

import { serve } from "@hono/node-server";

import { getConfig } from "./config";
import { createApp } from "./app";
import { createContainer } from "./lib/container";

const start = async () => {
  const config = getConfig();
  const container = await createContainer(config);
  const app = createApp(container);

  serve(
    {
      fetch: app.fetch,
      port: config.PORT
    },
    (info) => {
      console.log(`Server listening on http://localhost:${info.port}`);
    }
  );
};

start().catch((error: unknown) => {
  console.error("Failed to start server.", error);
  process.exitCode = 1;
});

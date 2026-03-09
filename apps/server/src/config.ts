import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();
loadEnv({ path: "apps/server/.env", override: false });

const ConfigSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1).default("file:./data/local.db"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development")
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export const getConfig = (overrides?: Partial<AppConfig>): AppConfig =>
  ConfigSchema.parse({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    ...overrides
  });

import { createGreeting, listGreetings } from "@hello/core";
import type { CreateGreeting, ListGreetings } from "@hello/core";
import { DrizzleGreetingRepository, createDatabaseClient } from "@hello/db";
import type { DatabaseClient } from "@hello/db";

import type { AppConfig } from "../config";

export interface AppContainer {
  database: DatabaseClient;
  createGreeting: CreateGreeting;
  listGreetings: ListGreetings;
}

export const createContainer = async (config: AppConfig): Promise<AppContainer> => {
  const database = await createDatabaseClient({
    url: config.DATABASE_URL
  });

  const greetingRepository = new DrizzleGreetingRepository(database.db);

  return {
    database,
    createGreeting: createGreeting(greetingRepository),
    listGreetings: listGreetings(greetingRepository)
  };
};

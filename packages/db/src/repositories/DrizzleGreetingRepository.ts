import { desc } from "drizzle-orm";

import type { GreetingRepository, GreetingRecord } from "@hello/core";

import { greetingsTable } from "../schema";
import type { createDatabaseClient } from "../client";

type Database = Awaited<ReturnType<typeof createDatabaseClient>>["db"];

export class DrizzleGreetingRepository implements GreetingRepository {
  constructor(private readonly db: Database) {}

  async create(greeting: GreetingRecord): Promise<GreetingRecord> {
    await this.db.insert(greetingsTable).values({
      id: greeting.id,
      name: greeting.name,
      message: greeting.message,
      createdAt: greeting.createdAt
    });

    return greeting;
  }

  async list(): Promise<GreetingRecord[]> {
    const rows = await this.db
      .select()
      .from(greetingsTable)
      .orderBy(desc(greetingsTable.createdAt));

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      message: row.message,
      createdAt: row.createdAt
    }));
  }
}

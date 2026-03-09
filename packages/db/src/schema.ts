import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const greetingsTable = sqliteTable("greetings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull()
});

import type { GreetingRecord } from "../greetings/types";

export interface GreetingRepository {
  create(greeting: GreetingRecord): Promise<GreetingRecord>;
  list(): Promise<GreetingRecord[]>;
}

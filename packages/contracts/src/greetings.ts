import { z } from "zod";

export const GreetingSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  message: z.string().min(1),
  createdAt: z.string().datetime()
});

export const CreateGreetingInputSchema = z.object({
  name: z.string()
});

export const CreateGreetingOutputSchema = GreetingSchema;

export const ListGreetingsOutputSchema = z.object({
  greetings: z.array(GreetingSchema)
});

export const HealthcheckOutputSchema = z.object({
  ok: z.literal(true),
  service: z.literal("hello-server"),
  timestamp: z.string().datetime()
});

export type Greeting = z.infer<typeof GreetingSchema>;
export type CreateGreetingInput = z.infer<typeof CreateGreetingInputSchema>;
export type CreateGreetingOutput = z.infer<typeof CreateGreetingOutputSchema>;
export type ListGreetingsOutput = z.infer<typeof ListGreetingsOutputSchema>;
export type HealthcheckOutput = z.infer<typeof HealthcheckOutputSchema>;

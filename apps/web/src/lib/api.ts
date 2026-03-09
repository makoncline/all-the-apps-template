import { createGreeting, listGreetings } from "@hello/sdk";

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_BASE_URL is required.");
  }

  return baseUrl;
};

export const greetingsApi = {
  list: () => listGreetings(getBaseUrl()),
  create: (name: string) => createGreeting({ name }, getBaseUrl())
};

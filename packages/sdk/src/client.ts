import type { ZodSchema } from "zod";

import { ApiError } from "./errors";

const DEFAULT_SERVER_BASE_URL = "http://localhost:3001";

export interface RequestOptions<TInput> {
  baseUrl?: string;
  body?: TInput;
  method?: "GET" | "POST";
  path: string;
  schema: ZodSchema;
}

const buildUrl = (baseUrl: string, path: string): string => {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBaseUrl}${path}`;
};

export const request = async <TInput, TOutput>({
  baseUrl = DEFAULT_SERVER_BASE_URL,
  body,
  method = "GET",
  path,
  schema
}: RequestOptions<TInput>): Promise<TOutput> => {
  const response = await fetch(buildUrl(baseUrl, path), {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return schema.parse(payload) as TOutput;
};

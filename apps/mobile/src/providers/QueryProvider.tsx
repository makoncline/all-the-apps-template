import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000
    }
  }
});

export const QueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    {children as React.ComponentProps<typeof QueryClientProvider>["children"]}
  </QueryClientProvider>
);

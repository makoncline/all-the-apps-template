"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

import { queryClient } from "../lib/queryClient";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

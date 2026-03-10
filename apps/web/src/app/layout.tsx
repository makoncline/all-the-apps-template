import type { Metadata } from "next";
import type React from "react";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello Monorepo",
  description: "Shared greetings app across web, mobile, desktop, CLI, and MCP."
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <Providers>{children as React.ReactNode}</Providers>
    </body>
  </html>
);

export default RootLayout;

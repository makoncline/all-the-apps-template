import type { Metadata } from "next";
import type React from "react";

import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "All the Apps Template",
  description: "One shared TypeScript core across web, mobile, desktop, CLI, and MCP."
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" suppressHydrationWarning>
    <body>
      <Providers>{children as React.ReactNode}</Providers>
    </body>
  </html>
);

export default RootLayout;

import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import ProvidersWrapper from "./providers-wrapper";

export const metadata: Metadata = {
  title: "Madgent — Trustless AI Agent Marketplace",
  description: "Autonomous AI agents with on-chain identity, reputation, and x402 payments on Monad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}

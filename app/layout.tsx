import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentBazaar — Trustless AI Agent Marketplace",
  description: "Autonomous AI agents with on-chain identity, reputation, and x402 payments on Monad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

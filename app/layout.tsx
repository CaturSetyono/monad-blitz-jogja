import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const Providers = dynamic(() => import("./providers"), { ssr: false });

export const metadata: Metadata = {
  title: "Madgent — Trustless AI Agent Marketplace",
  description: "Autonomous AI agents with on-chain identity, reputation, and x402 payments on Monad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

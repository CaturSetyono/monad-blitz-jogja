"use client";

import Link from "next/link";
import { shortenAddress } from "@/lib/format";

export default function DashboardHeader({
  title,
  address,
  chainId,
  connecting,
  onConnect,
}: {
  title: string;
  address: `0x${string}` | null;
  chainId: number | null;
  connecting: boolean;
  onConnect: () => void;
}) {
  const wrongChain = chainId !== null && chainId !== 10143;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <Link href="/" className="hidden lg:flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-tight text-white">AgentBazaar</span>
        </Link>

        <div className="lg:hidden font-display text-base font-semibold">{title}</div>

        <div className="flex-1" />

        <div className="ml-auto flex items-center gap-2">
          {wrongChain ? (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="bg-primary text-white px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display disabled:opacity-60"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : address ? (
            <div className="bg-violet-500/10 border border-violet-500/20 text-violet-200 px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display">
              {shortenAddress(address)}
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="bg-primary text-white px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display disabled:opacity-60"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

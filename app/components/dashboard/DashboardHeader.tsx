"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function DashboardHeader({
  title,
  address,
  chainId,
}: {
  title: string;
  address: `0x${string}` | null;
  chainId: number | null;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <Link href="/" className="hidden lg:flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-tight text-white">Madgent</span>
        </Link>

        <div className="lg:hidden font-display text-base font-semibold">{title}</div>

        <div className="flex-1" />

        <div className="ml-auto flex items-center gap-2">
          <ConnectButton.Custom>
            {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
              const ready = mounted;
              const connected = ready && !!account && !!chain;

              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-primary text-white px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported || chainId !== 10143) {
                return (
                  <button
                    onClick={openChainModal}
                    className="bg-amber-500/10 border border-amber-500/20 text-amber-100 px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display"
                  >
                    Switch Network
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="bg-violet-500/10 border border-violet-500/20 text-violet-200 px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display"
                >
                  {address ?? account.displayName}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}

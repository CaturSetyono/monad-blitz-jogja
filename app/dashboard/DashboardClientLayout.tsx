"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatusBar from "@/app/components/dashboard/StatusBar";
import { connectWallet, getChainId } from "@/lib/evm";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const needsChainSwitch = chainId !== null && chainId !== 10143;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const id = await getChainId();
        if (mounted) setChainId(id);
      } catch {
        // ignore: no injected wallet
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const headerTitle = useMemo(() => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.startsWith("/dashboard/developer")) return "Developer";
    if (pathname.startsWith("/dashboard/fraud-detection")) return "Fraud Detection System";
    return "Dashboard";
  }, [pathname]);

  async function onConnect() {
    setConnecting(true);
    try {
      const res = await connectWallet();
      setAddress(res.address);
      setChainId(res.chainId);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <DashboardHeader
        title={headerTitle}
        address={address}
        chainId={chainId}
        connecting={connecting}
        onConnect={onConnect}
      />
      <Sidebar />

      <main className="pt-20 lg:pl-64">
        <div className="px-6 sm:px-8 py-10">{children}</div>
      </main>

      <StatusBar chainId={chainId} needsChainSwitch={needsChainSwitch} />
    </div>
  );
}

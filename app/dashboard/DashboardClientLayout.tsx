"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import Sidebar from "@/app/components/dashboard/Sidebar";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatusBar from "@/app/components/dashboard/StatusBar";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const activeChainId = useChainId();
  const chainId = isConnected ? activeChainId : null;

  const needsChainSwitch = chainId !== null && chainId !== 10143;

  const headerTitle = useMemo(() => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.startsWith("/dashboard/developer")) return "Developer";
    if (pathname.startsWith("/dashboard/fraud-detection")) return "Fraud Detection System";
    return "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-white">
      <DashboardHeader
        title={headerTitle}
        address={address ?? null}
        chainId={chainId}
      />
      <Sidebar />

      <main className="pt-20 lg:pl-64">
        <div className="px-6 sm:px-8 py-10">{children}</div>
      </main>

      <StatusBar chainId={chainId} needsChainSwitch={needsChainSwitch} />
    </div>
  );
}

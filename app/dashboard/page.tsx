"use client";

import { useEffect, useState } from "react";
import MetricCard from "@/app/components/dashboard/MetricCard";
import CounterPanel from "@/app/components/dashboard/panels/CounterPanel";
import ActivityFeed from "@/app/components/dashboard/panels/ActivityFeed";

export default function DashboardOverviewPage() {
  const [spark, setSpark] = useState<number[]>([2, 3, 4, 3, 5, 4]);

  useEffect(() => {
    // tiny deterministic animation so the UI doesn't look dead without data
    const t = setInterval(() => {
      setSpark((prev) => {
        const next = prev.slice(1);
        next.push(Math.max(1, Math.min(8, prev[prev.length - 1] + (Math.random() > 0.5 ? 1 : -1))));
        return next;
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">Monitoring your agents on Monad Testnet (10143)</p>
        </div>

        <div className="flex gap-3">
          <button className="glass-card rounded-md px-5 py-3 text-[10px] uppercase tracking-widest font-bold font-display text-slate-200 hover:bg-white/5 transition-colors">
            Generate Report
          </button>
          <button className="bg-primary text-white rounded-md px-5 py-3 text-[10px] uppercase tracking-widest font-bold font-display hover:opacity-95 transition-opacity">
            Deploy Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Earnings" value="$0.00" change="+0.0%" changePositive chartData={spark} footer="Wire settlement contract to populate" />
        <MetricCard title="Active Agents" value="0" badge={[{ label: "LIVE", color: "green" }]} chartData={[1, 1, 2, 2, 1, 2]} footer="AgentRegistry not deployed yet" />
        <MetricCard title="Total Calls" value="0" suffix="" chartData={[2, 3, 2, 4, 3, 5]} footer="Events feed stubbed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <CounterPanel />
          <ActivityFeed />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Alerts</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">0 active</span>
            </div>
            <p className="text-slate-400 text-sm mt-3">No alerts. Once ReputationModule and settlement are deployed, disputes and low-balance warnings will show here.</p>
          </div>

          <div className="glass-card rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Earnings (24h)</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">stub</span>
            </div>
            <div className="mt-6 h-32 rounded-md bg-white/3 border border-white/8" />
            <p className="text-slate-500 text-xs mt-3">Hook this up to `PaymentSettled` events once contracts are live.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

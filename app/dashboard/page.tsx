"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MetricCard from "@/app/components/dashboard/MetricCard";
import CounterPanel from "@/app/components/dashboard/panels/CounterPanel";
import ActivityFeed from "@/app/components/dashboard/panels/ActivityFeed";
import { loadHistory, clearHistory, type HistoryEntry } from "@/lib/agent-history";

const TASK_LABELS: Record<string, string> = {
  code_review: "Code Review",
  security_scan: "Security Scan",
  run_lint: "Run Lint",
  run_build: "Run Build",
  suggest_refactor: "Suggest Refactor",
};

function fmtTs(ts: string) {
  try {
    return new Date(ts).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

function HistoryPanel({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  function handleClear() {
    clearHistory();
    setEntries([]);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        className="flex-1 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="w-full max-w-md bg-[#0a0a12] border-l border-white/8 flex flex-col h-full">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <h2 className="font-display text-lg font-semibold">Agent Run History</h2>
            <p className="text-slate-500 text-xs mt-0.5">{entries.length} recorded run{entries.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2v10M5.5 7L10 2l4.5 5M3 18h14" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-slate-500 text-sm">No runs yet.</p>
              <p className="text-slate-600 text-xs mt-1">Run an agent to see history here.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="glass-card rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {entry.type === "developer" ? (
                      <span className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3.5 4L1 6l2.5 2M8.5 4L11 6l-2.5 2M7 2.5l-2 7" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1L1.5 3v3c0 2.5 2 4.5 4.5 5 2.5-.5 4.5-2.5 4.5-5V3L6 1z" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
                      {entry.type === "developer" ? "Developer" : "Fraud Detection"}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold font-display px-2 py-0.5 rounded ${
                    entry.status === "success"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : entry.status === "payment_required"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-red-500/15 text-red-400"
                  }`}>
                    {entry.status === "payment_required" ? "Payment Required" : entry.status}
                  </span>
                </div>

                {entry.type === "developer" && (
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div className="flex gap-2">
                      <span className="text-slate-600">Task</span>
                      <span className="text-slate-300">{TASK_LABELS[entry.task] ?? entry.task}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600">Repo</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{entry.repoUrl}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-600">Branch</span>
                      <span className="text-slate-300">{entry.branch}</span>
                    </div>
                    {entry.firstLog && (
                      <div className="mt-1 text-slate-500 font-mono text-[10px] truncate">{entry.firstLog}</div>
                    )}
                  </div>
                )}

                {entry.type === "fraud" && (
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div className="flex gap-2">
                      <span className="text-slate-600">Token</span>
                      <span className="text-slate-300 font-mono">{entry.tokenAddress.slice(0, 8)}…{entry.tokenAddress.slice(-6)}</span>
                    </div>
                    {entry.status === "success" && (
                      <>
                        <div className="flex gap-2">
                          <span className="text-slate-600">Name</span>
                          <span className="text-slate-300">{entry.tokenName} ({entry.tokenSymbol})</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${entry.riskScore > 60 ? "bg-red-500" : entry.riskScore > 30 ? "bg-amber-500" : "bg-emerald-500"}`} />
                            <span className="text-slate-300 font-semibold">Risk {entry.riskScore}/100</span>
                          </div>
                          <span className={entry.safeToInteract ? "text-emerald-400" : "text-red-400"}>
                            {entry.safeToInteract ? "Safe" : "Unsafe"}
                          </span>
                          {entry.flagCount > 0 && (
                            <span className="text-red-400">{entry.flagCount} flag{entry.flagCount !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="text-[10px] text-slate-600">{fmtTs(entry.ts)}</div>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className="px-6 py-4 border-t border-white/8">
            <button
              onClick={handleClear}
              className="w-full text-[10px] uppercase tracking-widest font-bold font-display text-slate-500 hover:text-red-400 transition-colors py-2"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const [spark, setSpark] = useState<number[]>([2, 3, 4, 3, 5, 4]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
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
      {showReport && <HistoryPanel onClose={() => setShowReport(false)} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">Monitoring your agents on Monad Testnet (10143)</p>
        </div>

        <button
          onClick={() => setShowReport(true)}
          className="glass-card rounded-md px-5 py-3 text-[10px] uppercase tracking-widest font-bold font-display text-slate-200 hover:bg-white/5 transition-colors"
        >
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Earnings" value="$0.00" change="+0.0%" changePositive chartData={spark} footer="Wire settlement contract to populate" />
        <MetricCard title="Active Agents" value="2" badge={[{ label: "LIVE", color: "green" }]} chartData={[1, 1, 2, 2, 1, 2]} footer="Developer + Fraud Detection" />
        <MetricCard title="Total Calls" value="0" suffix="" chartData={[2, 3, 2, 4, 3, 5]} footer="Events feed stubbed" />
      </div>

      {/* Agent Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Available Agents</h2>
          <span className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-500">2 active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Developer Agent */}
          <Link href="/dashboard/developer" className="block group">
            <div className="glass-card rounded-lg p-6 h-full flex flex-col hover:bg-white/[0.03] transition-colors border border-transparent hover:border-violet-500/20">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 7L2 10l4 3M14 7l4 3-4 3M11.5 4l-3 12" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold font-display text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Active</span>
              </div>

              <div className="mt-4">
                <h3 className="font-display text-lg font-semibold text-white">Developer Agent</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Reviews code, runs security scans, lint, and build checks on your smart contracts and application code. Connects to any GitHub, GitLab, or self-hosted repo and produces PR-style findings.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Code Review", "Security Scan", "Lint", "Build", "Refactor"].map((cap) => (
                  <span key={cap} className="bg-violet-500/10 text-violet-300 text-[10px] px-2.5 py-1 rounded-full font-medium">{cap}</span>
                ))}
              </div>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5 align-middle" />
                  Free · endpoint: <span className="font-mono">:3002</span>
                </div>
                <span className="text-violet-400 text-sm font-semibold font-display flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </Link>

          {/* Fraud Detection Agent */}
          <Link href="/dashboard/fraud-detection" className="block group">
            <div className="glass-card rounded-lg p-6 h-full flex flex-col hover:bg-white/[0.03] transition-colors border border-transparent hover:border-red-500/20">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 5.5v5c0 4 3 7 7 7.5 4-.5 7-3.5 7-7.5v-5L10 2z" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9v2M10 13h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold font-display text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Active</span>
              </div>

              <div className="mt-4">
                <h3 className="font-display text-lg font-semibold text-white">Fraud Detection Agent</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  AI-powered ERC20 token analysis on Monad. Detects honeypots, rug pulls, minting backdoors, and suspicious ownership patterns. Returns a risk score 0–100 with per-category breakdown.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Honeypot Detect", "Rug Pull", "Owner Analysis", "Supply Scan", "Risk Score"].map((cap) => (
                  <span key={cap} className="bg-red-500/10 text-red-300 text-[10px] px-2.5 py-1 rounded-full font-medium">{cap}</span>
                ))}
              </div>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5 align-middle" />
                  $0.25/analysis · <span className="font-mono">x402</span>
                </div>
                <span className="text-red-400 text-sm font-semibold font-display flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
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

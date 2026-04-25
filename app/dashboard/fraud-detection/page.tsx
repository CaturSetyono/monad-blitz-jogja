"use client";

import { useState } from "react";
import { saveHistoryEntry } from "@/lib/agent-history";

type FraudResult = {
  tokenAddress: string;
  tokenInfo: { name: string; symbol: string; decimals: number };
  riskScore: number;
  recommendation: string;
  flags: string[];
  summary: string;
  detailedAnalysis: Record<string, { score: number; explanation: string }>;
  recommendations: string[];
  safeToInteract: boolean;
  analyzedAt: string;
};

type LogEntry = { ts: string; level: "info" | "warn" | "error"; msg: string };

export default function DashboardFraudDetectionPage() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState("");

  async function analyze() {
    if (!tokenAddress.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError("");
    setLogs([{ ts: new Date().toISOString(), level: "info", msg: `Analyzing ${tokenAddress}...` }]);

    try {
      const fraudAgentUrl = process.env.NEXT_PUBLIC_FRAUD_AGENT_URL ?? "http://localhost:3001";
      const resp = await fetch(`${fraudAgentUrl}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAddress: tokenAddress.trim(), chainId: 10143 }),
      });

      if (resp.status === 402) {
        setLogs((l) => [...l, { ts: new Date().toISOString(), level: "warn", msg: "Payment required (x402). Connect wallet to pay $0.25." }]);
        setError("Payment required. This is a paid agent ($0.25/task via x402).");
        saveHistoryEntry({ type: "fraud", ts: new Date().toISOString(), tokenAddress: tokenAddress.trim(), tokenName: "", tokenSymbol: "", riskScore: 0, recommendation: "", safeToInteract: false, flagCount: 0, status: "payment_required" });
        return;
      }

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Agent returned ${resp.status}: ${errText.slice(0, 200)}`);
      }

      const data = await resp.json();
      const fraudResult = data.result as FraudResult;
      setResult(fraudResult);
      setLogs((l) => [
        ...l,
        { ts: new Date().toISOString(), level: "info", msg: `Analysis complete: ${fraudResult.recommendation} (risk: ${fraudResult.riskScore}/100)` },
        { ts: new Date().toISOString(), level: fraudResult.riskScore > 60 ? "error" : fraudResult.riskScore > 30 ? "warn" : "info", msg: fraudResult.summary },
      ]);
      saveHistoryEntry({ type: "fraud", ts: new Date().toISOString(), tokenAddress: tokenAddress.trim(), tokenName: fraudResult.tokenInfo.name, tokenSymbol: fraudResult.tokenInfo.symbol, riskScore: fraudResult.riskScore, recommendation: fraudResult.recommendation, safeToInteract: fraudResult.safeToInteract, flagCount: fraudResult.flags.length, status: "success" });
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      setLogs((l) => [...l, { ts: new Date().toISOString(), level: "error", msg }]);
      saveHistoryEntry({ type: "fraud", ts: new Date().toISOString(), tokenAddress: tokenAddress.trim(), tokenName: "", tokenSymbol: "", riskScore: 0, recommendation: "", safeToInteract: false, flagCount: 0, status: "error" });
    } finally {
      setLoading(false);
    }
  }

  function riskColor(score: number) {
    if (score <= 20) return "text-emerald-400";
    if (score <= 40) return "text-green-400";
    if (score <= 60) return "text-amber-400";
    if (score <= 80) return "text-orange-400";
    return "text-red-400";
  }

  function riskBar(score: number) {
    const color = score <= 30 ? "bg-emerald-500" : score <= 60 ? "bg-amber-500" : "bg-red-500";
    return (
      <div className="w-full bg-white/5 rounded-full h-2 mt-1">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Fraud Detection</h1>
        <p className="text-slate-400 text-sm mt-2">AI-powered token fraud analysis on Monad. Detects honeypots, rug pulls, and suspicious contracts.</p>
      </div>

      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">Token Address</label>
            <input
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-slate-900/40 border border-white/10 rounded-md px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-primary/40 font-mono"
            />
          </div>
          <button
            onClick={analyze}
            disabled={!tokenAddress.trim() || loading}
            className="bg-primary text-white rounded-md px-6 py-3 text-[10px] uppercase tracking-widest font-bold font-display disabled:opacity-60 h-[46px] mt-5"
          >
            {loading ? "Analyzing..." : "Analyze $0.25"}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card rounded-lg p-4 border border-red-500/30">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-lg p-6 lg:col-span-1">
            <h2 className="font-display text-lg font-semibold mb-4">Risk Score</h2>
            <div className="text-center">
              <div className={`text-6xl font-bold ${riskColor(result.riskScore)}`}>{result.riskScore}</div>
              <div className="text-slate-400 text-sm mt-1">/100</div>
              {riskBar(result.riskScore)}
              <div className={`mt-3 text-sm font-bold ${riskColor(result.riskScore)}`}>{result.recommendation}</div>
              <div className="mt-2 text-sm text-slate-400">
                Safe to interact: <span className={result.safeToInteract ? "text-emerald-400" : "text-red-400"}>{result.safeToInteract ? "YES" : "NO"}</span>
              </div>
            </div>

            {result.flags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Flags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.flags.map((f) => (
                    <span key={f} className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-slate-500">
              {result.tokenInfo.name} ({result.tokenInfo.symbol}) · Decimals: {result.tokenInfo.decimals}
            </div>
          </div>

          <div className="glass-card rounded-lg p-6 lg:col-span-2 space-y-4">
            <h2 className="font-display text-lg font-semibold">Detailed Analysis</h2>
            <p className="text-slate-300 text-sm">{result.summary}</p>

            {result.detailedAnalysis && Object.entries(result.detailedAnalysis).map(([key, val]) => (
              <div key={key} className="border border-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className={`text-sm font-bold ${riskColor(val.score)}`}>{val.score}/100</span>
                </div>
                {riskBar(val.score)}
                <p className="text-slate-400 text-xs mt-2">{val.explanation}</p>
              </div>
            ))}

            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-primary">→</span>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="glass-card rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold mb-3">Console</h2>
        <div className="bg-black/30 border border-white/10 rounded-md p-4 font-mono text-xs leading-relaxed min-h-24">
          {logs.length === 0 ? (
            <div className="text-slate-500">Enter a token address and click Analyze.</div>
          ) : (
            <div className="space-y-1">
              {logs.map((l, i) => (
                <div key={i} className={l.level === "error" ? "text-red-200" : l.level === "warn" ? "text-amber-200" : "text-slate-200"}>
                  <span className="text-slate-500">[{l.ts}]</span> {l.msg}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

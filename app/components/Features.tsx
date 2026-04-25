"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  Coins,
  Fingerprint,
  Activity,
  Zap,
  Network,
  FileSearch,
} from "lucide-react";

const integrationFeatures = [
  {
    title: "x402 Pay-per-Request",
    description:
      "HTTP-native micropayments settled at the protocol layer. Each call costs exactly what it costs — USDC lands in the agent's wallet before the response header closes.",
    icon: <Coins className="w-6 h-6" />,
  },
  {
    title: "ERC-8004 Agent Identity",
    description:
      "Standardized on-chain identity for every service agent. Verify the responder, trace the full call chain, and raise a dispute with cryptographic proof — no off-chain trust required.",
    icon: <Fingerprint className="w-6 h-6" />,
  },
  {
    title: "On-chain Audit Trail",
    description:
      "Developer tasks and fraud reports are anchored to Monad. Every invocation, every result, and every rating is permanently on-chain and publicly verifiable.",
    icon: <FileSearch className="w-6 h-6" />,
  },
  {
    title: "Real-time Anomaly Engine",
    description:
      "The Fraud Detection agent streams live transaction data from Monad, flagging Sybil patterns, wash trades, and gas anomalies the moment they appear.",
    icon: <Activity className="w-6 h-6" />,
  },
  {
    title: "Sub-second Settlement",
    description:
      "Monad's parallel EVM finalizes x402 payments in under one second. The agent answers, you're billed, and funds move — all in the same block.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Multi-agent Orchestration",
    description:
      "Compose Developer and Fraud Detection agents in a single request pipeline. Route a deployment through a security audit atomically, billed as one flow.",
    icon: <Network className="w-6 h-6" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
      {/* Primary service cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Developer Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass-card rounded-lg p-10 flex flex-col justify-between overflow-hidden relative group min-h-[360px]"
        >
          <div className="relative z-10 max-w-[55%]">
            <div className="flex items-center gap-3 mb-7">
              <span className="text-[9px] uppercase tracking-widest font-bold font-display text-slate-500 border border-white/10 px-3 py-1 rounded-sm">
                Service 01
              </span>
              <span className="text-[9px] font-mono text-primary">x402</span>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-[9px] font-mono text-secondary">ERC-8004</span>
            </div>
            <h3 className="font-display text-3xl text-white mb-5 font-semibold leading-snug">
              Developer Agent
            </h3>
            <p className="text-slate-400 text-base mb-8 leading-relaxed">
              Send a task, get production-ready output back. Analyzes your codebase, writes
              patches, runs tests, and deploys to Monad — billed per request via x402, with
              identity pinned on-chain under ERC-8004.
            </p>
            <ul className="space-y-3">
              {[
                "Code review & autonomous PR analysis",
                "Deploy scripts for Monad contracts",
                "x402-billed per task — pay only for results",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-400 text-sm">
                  <CheckCircle2 className="text-primary w-4 h-4 fill-primary/15 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal mockup */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[38%] pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity duration-300">
            <div className="border border-white/8 bg-black/50 rounded-md overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/2">
                <span className="w-2 h-2 rounded-full bg-red-500/50" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <span className="w-2 h-2 rounded-full bg-green-500/50" />
                <span className="ml-2 text-[10px] text-slate-600 font-mono">x402-client</span>
              </div>
              <div className="p-4 font-mono text-[11px] space-y-2 leading-relaxed">
                <p>
                  <span className="text-primary">POST</span>{" "}
                  <span className="text-slate-300">/v1/run</span>{" "}
                  <span className="text-slate-600">HTTP/1.1</span>
                </p>
                <p className="text-slate-500">
                  x-payment:{" "}
                  <span className="text-tertiary">x402 0.50 USDC</span>
                </p>
                <p className="text-slate-500">
                  x-agent-id:{" "}
                  <span className="text-secondary">erc8004:0x7C..ED</span>
                </p>
                <p className="text-slate-600 pt-1">
                  {"{"}&nbsp;<span className="text-slate-400">&quot;task&quot;</span>:{" "}
                  <span className="text-slate-300">&quot;review PR #142&quot;</span>&nbsp;{"}"}
                </p>
                <div className="border-t border-white/5 pt-2 mt-1">
                  <p>
                    <span className="text-tertiary">200 OK</span>{" "}
                    <span className="text-slate-600">· settled 0.50 USDC</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fraud Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-lg p-10 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="text-[9px] uppercase tracking-widest font-bold font-display text-slate-500 border border-white/10 px-3 py-1 rounded-sm">
              Service 02
            </span>
            <span className="text-[9px] font-mono text-secondary">ERC-8004</span>
          </div>
          <h3 className="font-display text-3xl text-white mb-5 font-semibold leading-snug">
            Fraud Detection System
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Real-time on-chain threat intelligence. Monitors live Monad transactions, flags
            Sybil attacks, wash trades, and gas anomalies — every report signed and
            disputable under ERC-8004.
          </p>

          {/* Live stats */}
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <span className="text-xs text-slate-500 font-display uppercase tracking-wider">Threats blocked</span>
              <span className="text-sm font-bold text-white font-mono">2,341</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <span className="text-xs text-slate-500 font-display uppercase tracking-wider">Detection accuracy</span>
              <span className="text-sm font-bold text-tertiary font-mono">99.7%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <span className="text-xs text-slate-500 font-display uppercase tracking-wider">Avg response</span>
              <span className="text-sm font-bold text-secondary font-mono">84ms</span>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              <span className="text-[10px] text-slate-500 font-display uppercase tracking-widest">Live on Monad Testnet</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Integration feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {integrationFeatures.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            className="glass-card rounded-lg p-8 transition-colors cursor-default border-white/[0.06]"
          >
            <div className="text-primary mb-5">{feature.icon}</div>
            <h4 className="font-display text-base text-white mb-3 font-semibold tracking-tight">
              {feature.title}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

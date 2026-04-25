"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Coins, Fingerprint, ShieldCheck } from "lucide-react";

type Service = "developer" | "fraud" | "both";

const services: { value: Service; label: string; sub: string }[] = [
  { value: "developer", label: "Developer Agent", sub: "Code, deploy, review" },
  { value: "fraud", label: "Fraud Detection", sub: "On-chain threat intel" },
  { value: "both", label: "Both Services", sub: "Full stack coverage" },
];

export default function ContactForm() {
  const [selected, setSelected] = useState<Service>("both");

  return (
    <section id="contact" className="py-32 px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left copy */}
        <div className="lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl text-white mb-8 font-semibold tracking-tight leading-tight">
              Start using AgentBazaar services today.
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-md">
              Get early access to the Developer Agent and Fraud Detection System. Both services
              are x402-billed per request — you pay only for results, settled in USDC on Monad,
              with every agent verified under ERC-8004.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <Coins className="text-primary w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">x402 pay-per-use — no subscription, no waste</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <Fingerprint className="text-primary w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">ERC-8004 verified agents you can audit on-chain</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <ShieldCheck className="text-primary w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Every result signed and disputable on Monad</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 glass-card p-12 rounded-2xl shadow-2xl"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Name + email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400 block px-1">
                Your name
              </label>
              <input
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent px-5 py-4 outline-none transition-all"
                placeholder="Alice"
                type="text"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400 block px-1">
                Contact email
              </label>
              <input
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent px-5 py-4 outline-none transition-all"
                placeholder="alice@yourproject.xyz"
                type="email"
              />
            </div>
          </div>

          {/* Service selector */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400 block px-1">
              Service interest
            </label>
            <div className="grid grid-cols-3 gap-3">
              {services.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelected(s.value)}
                  className={`px-4 py-4 rounded-xl border text-left transition-all ${
                    selected === s.value
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <p className="text-xs font-bold font-display leading-tight mb-1">{s.label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{s.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Use case */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400 block px-1">
              How do you plan to use it?
            </label>
            <textarea
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:border-transparent px-5 py-4 outline-none transition-all resize-none"
              placeholder="Describe your project, what you want the agent to do, and your expected call volume."
              rows={5}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-5 rounded-xl text-xs uppercase tracking-widest font-bold font-display neon-glow transition-all"
            type="submit"
          >
            Request Early Access
          </motion.button>

          <p className="text-center text-slate-600 text-xs">
            Billed via x402 on Monad Testnet · ERC-8004 identity on every request
          </p>
        </motion.form>
      </div>
    </section>
  );
}

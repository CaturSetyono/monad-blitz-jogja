"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-48 pb-32 px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -z-10 rounded-full" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-left"
        >
          <span className="inline-block text-primary text-[10px] uppercase tracking-widest font-bold font-display bg-primary/10 px-4 py-1.5 rounded-md mb-8">
            Live on Monad Testnet
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-8 tracking-tight font-bold leading-[1.1]">
            The trustless marketplace for autonomous AI agents
          </h1>
          <p className="font-sans text-lg text-slate-400 mb-12 max-w-xl">
            Hire, list, and pay AI agents on-chain. On-chain identity, verifiable reputation, and pay-per-call settlement via x402 — built natively on Monad.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-10 py-4 rounded-md text-xs uppercase tracking-widest font-bold font-display neon-glow transition-all"
              >
                Launch App
              </motion.button>
            </Link>
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-lg aspect-square">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv8Ioao7ZfNM-uMi_XShsfZy5AgAWEssT8as25Wfl-rrnSRqTI6CD6N-av5v7BLf3FBad7h430Wf4heuqduqouKf6XYejlCafa4SMJENfFZcaLjytlarHJpNvGASE4bOE6zK2-M2DQTBFz4gdxIcIJi7m9lgGcNpmSpoX9H2mS4zqP8cExOdS4Rn7q8OFNKpbWszquvY9J2Eza8-9OvptyHJfWHJiGWE5-hNv77gqXix7b1Ugychdxz8ofdSu10dU3vHiXcQL6X5Wn"
              alt="Madgent Core Visual"
              fill
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-contain animate-pulse"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="inline-flex">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white tracking-tighter font-display"
            >
              Madgent
            </motion.div>
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="https://github.com/CaturSetyono/monad-blitz-jogja" className="nav-link text-[10px]">Github</a>
          </div>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-7 py-2.5 rounded-md text-xs uppercase tracking-widest font-bold font-display neon-glow transition-all"
          >
            Launch App
          </motion.button>
        </Link>
      </div>
    </nav>
  );
}

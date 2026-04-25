"use client";

import { useEffect, useState, useTransition } from "react";
import { useAccount } from "wagmi";
import { readCounterNumber, writeCounterIncrement, writeCounterSetNumber } from "@/lib/contracts/counter";

export default function CounterPanel() {
  const { address } = useAccount();
  const [number, setNumber] = useState<bigint | null>(null);
  const [setValue, setSetValue] = useState("0");
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try {
      const n = await readCounterNumber();
      setNumber(n);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onIncrement() {
    setErr(null);
    if (!address) {
      setErr("Connect a wallet in the header first.");
      return;
    }
    startTransition(async () => {
      try {
        await writeCounterIncrement();
        await refresh();
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  async function onSetNumber() {
    setErr(null);
    if (!address) {
      setErr("Connect a wallet in the header first.");
      return;
    }
    const parsed = Number(setValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setErr("Enter a non-negative number.");
      return;
    }
    startTransition(async () => {
      try {
        await writeCounterSetNumber(BigInt(Math.floor(parsed)));
        await refresh();
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  return (
    <section className="glass-card rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">On-chain Counter (Existing Contract)</h2>
          <p className="text-slate-400 text-sm mt-2">This is wired to `contracts/src/Counter.sol`. Set `NEXT_PUBLIC_COUNTER_ADDRESS` to your deployed address.</p>
        </div>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display text-slate-200 bg-white/3 border border-white/8 hover:bg-white/5 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-5xl font-display font-bold tracking-tight text-white">
          {number === null ? "..." : number.toString()}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onIncrement}
            disabled={pending}
            className="bg-primary text-white rounded-md px-5 py-3 text-[10px] uppercase tracking-widest font-bold font-display disabled:opacity-60"
          >
            Increment
          </button>

          <div className="flex items-center gap-2 bg-white/3 border border-white/8 rounded-md px-3 py-2">
            <input
              value={setValue}
              onChange={(e) => setSetValue(e.target.value)}
              className="w-28 bg-transparent outline-none text-sm text-slate-200"
              inputMode="numeric"
            />
            <button
              onClick={onSetNumber}
              disabled={pending}
              className="px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold font-display text-slate-200 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-60"
            >
              Set
            </button>
          </div>
        </div>
      </div>

      {err ? <div className="mt-4 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-md px-4 py-3">{err}</div> : null}
    </section>
  );
}

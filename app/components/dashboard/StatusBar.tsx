"use client";

export default function StatusBar({
  chainId,
  needsChainSwitch,
}: {
  chainId: number | null;
  needsChainSwitch: boolean;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="glass-card rounded-md px-4 py-2 flex items-center gap-3">
        <span
          className={
            "w-2 h-2 rounded-full " +
            (needsChainSwitch ? "bg-amber-400" : "bg-emerald-500 animate-pulse")
          }
        />
        <span className="text-xs text-slate-200">System {needsChainSwitch ? "Needs Chain" : "Operational"}</span>
        <span className="text-xs text-slate-500">|</span>
        <span className="text-xs text-slate-400">Monad Testnet</span>
        <span className="text-xs text-slate-500">{chainId ? `(${chainId})` : ""}</span>
      </div>
    </div>
  );
}

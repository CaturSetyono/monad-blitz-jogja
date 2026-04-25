export default function ActivityFeed() {
  return (
    <section className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Recent Activity</h2>
        <span className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">stub</span>
      </div>
      <div className="mt-4 space-y-3">
        {[
          "No activity yet. Once you watch on-chain events, they show up here.",
          "Tip: use viem `watchContractEvent` and aggregate into local state.",
        ].map((t) => (
          <div key={t} className="bg-white/3 border border-white/8 rounded-md px-4 py-3 text-sm text-slate-300">
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

import MiniBarChart from "./MiniBarChart";

export default function MetricCard({
  title,
  value,
  suffix,
  change,
  changePositive,
  chartData,
  badge,
  footer,
}: {
  title: string;
  value: string;
  suffix?: string;
  change?: string;
  changePositive?: boolean;
  chartData?: number[];
  badge?: { label: string; color: "green" | "blue" | "violet" }[];
  footer?: string;
}) {
  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold font-display text-slate-400">{title}</div>
          <div className="mt-3 flex items-end gap-2">
            <div className="font-display text-3xl font-semibold tracking-tight text-white">{value}</div>
            {suffix ? <div className="text-slate-400 text-sm mb-1">{suffix}</div> : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge?.map((b) => {
            const cls =
              b.color === "green"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                : b.color === "blue"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-200"
                  : "bg-violet-500/10 border-violet-500/20 text-violet-200";
            return (
              <span
                key={b.label}
                className={
                  "px-2.5 py-1 rounded-md border text-[10px] uppercase tracking-widest font-bold font-display " +
                  cls
                }
              >
                {b.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {change ? (
          <div className={"text-xs font-medium " + (changePositive ? "text-emerald-300" : "text-slate-400")}>
            {change}
          </div>
        ) : (
          <div />
        )}
      </div>

      {chartData ? (
        <div className="mt-5">
          <MiniBarChart data={chartData} />
        </div>
      ) : null}

      {footer ? <div className="mt-4 text-xs text-slate-500">{footer}</div> : null}
    </div>
  );
}

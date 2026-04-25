export default function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="flex items-end gap-1 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-md bg-primary/20 border border-primary/15"
          style={{ height: `${Math.max(12, Math.round((v / max) * 100))}%` }}
        />
      ))}
    </div>
  );
}

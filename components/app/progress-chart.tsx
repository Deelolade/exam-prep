import type { TrendPoint } from "@/data/study";

/**
 * Small, restrained accuracy trend chart (hand-rolled SVG-free bars).
 * The latest point is highlighted in the gold accent.
 */
export default function ProgressChart({
  data,
  className,
}: {
  data: TrendPoint[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-end gap-2 h-24">
        {data.map((point, i) => {
          const isLatest = i === data.length - 1;
          return (
            <div key={point.label} className="flex-1 flex flex-col justify-end h-full gap-1">
              <span className="text-[10px] font-medium text-slate-400 text-center">
                {point.value}%
              </span>
              <div
                className={`w-full rounded-t ${isLatest ? "bg-primary" : "bg-slate-200"}`}
                style={{ height: `${point.value}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-1.5">
        {data.map((point) => (
          <span key={point.label} className="flex-1 text-center text-[10px] text-slate-400">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

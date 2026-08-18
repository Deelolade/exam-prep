import type { DayCount } from "@/lib/exam-data";

/**
 * Small, restrained bar chart (hand-rolled, no chart library).
 * Bar heights are relative to `max`; the latest point is highlighted in the
 * gold accent.
 */
export default function ProgressChart({
  data,
  max = 100,
  className,
}: {
  data: DayCount[];
  max?: number;
  className?: string;
}) {
  const scale = max > 0 ? max : 1;

  return (
    <div className={className}>
      <div className="flex items-end gap-2 h-24">
        {data.map((point, i) => {
          const isLatest = i === data.length - 1;
          const height = Math.round((point.value / scale) * 100);
          return (
            <div key={point.label} className="flex-1 flex flex-col justify-end h-full gap-1">
              <span className="text-[10px] font-medium text-slate-400 text-center">
                {point.value}
              </span>
              <div
                className={`w-full rounded-t ${isLatest ? "bg-primary" : "bg-slate-200"}`}
                style={{ height: `${Math.max(height, 1)}%` }}
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

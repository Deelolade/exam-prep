import { FiGrid } from "react-icons/fi";

type NavigatorProps = {
  count: number;
  current: number;
  answers: (number | null)[];
  flags: boolean[];
  onJump: (index: number) => void;
};

export default function Navigator({ count, current, answers, flags, onJump }: NavigatorProps) {
  return (
    <aside className="w-full lg:w-57.5 lg:shrink-0 lg:sticky lg:top-28">
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-slate-500 mb-2.5 flex items-center gap-1.5">
        <FiGrid className="w-3.5 h-3.5" aria-hidden="true" />
        Navigator
      </p>

      <div className="grid grid-cols-10 lg:grid-cols-5 gap-1.5 mb-4">
        {Array.from({ length: count }).map((_, i) => {
          const isCurrent = i === current;
          const answered = answers[i] !== null;
          const flagged = flags[i];

          const classes = [
            "relative aspect-square rounded-md border font-mono text-[11px] flex items-center justify-center cursor-pointer transition",
            answered ? "bg-dark border-dark text-white" : "bg-white border-slate-300 text-slate-500 hover:border-slate-500",
            isCurrent && "border-primary ring-1 ring-primary",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              aria-label={`Go to question ${i + 1}${flagged ? " (flagged)" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={classes}
            >
              {i + 1}
              {flagged && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warning border border-white"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[11.5px] text-slate-500 leading-[1.9]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block shrink-0" aria-hidden="true" />
          Answered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-white border border-slate-300 inline-block shrink-0" aria-hidden="true" />
          Unanswered
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded border-2 border-primary inline-block shrink-0" aria-hidden="true" />
          Current
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-warning inline-block shrink-0" aria-hidden="true" />
          Flagged
        </div>
      </div>
    </aside>
  );
}

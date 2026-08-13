import type { Section, Question } from "@/data/questions";

type SegmentedBarProps = {
  sections: Section[];
  questions: Question[];
  answers: (number | null)[];
};

/** One segment per exam section — filled by the ratio of answered questions. */
export default function SegmentedBar({ sections, questions, answers }: SegmentedBarProps) {
  const total = questions.length;

  return (
    <div className="flex gap-0.75 max-w-295 mx-auto px-5 pb-3">
      {sections.map((s) => {
        const sectionIndexes = questions
          .map((q, i) => ({ q, i }))
          .filter((o) => o.q.section === s.code)
          .map((o) => o.i);
        const answeredCount = sectionIndexes.filter((i) => answers[i] !== null).length;
        const pct = (answeredCount / sectionIndexes.length) * 100;

        return (
          <div
            key={s.code}
            role="progressbar"
            aria-label={`Section ${s.code}: ${s.name}`}
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.75 rounded-[3px] bg-slate-200 relative overflow-hidden shrink-0"
            style={{ width: `${(s.count / total) * 100}%`, flexGrow: 1 }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 rounded-[3px] transition-[width] duration-300"
              style={{ width: `${pct}%`, background: s.color }}
            />
          </div>
        );
      })}
    </div>
  );
}

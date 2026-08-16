import { CARD, SECTION_TITLE } from "@/components/app/ui";
import ProgressChart from "@/components/app/progress-chart";
import { METRICS, PRACTICE_SUBJECTS, TREND } from "@/data/study";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Progress</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track how your preparation is improving over time.
        </p>
      </div>

      <section>
        <h2 className={SECTION_TITLE}>Overview</h2>
        <div className={`${CARD} mt-3 grid grid-cols-3 divide-x divide-slate-100 p-5 sm:p-6`}>
          {METRICS.map((metric) => (
            <div key={metric.label} className="px-4 first:pl-0 last:pr-0 sm:px-6">
              <p className="text-xl font-semibold tracking-tight text-dark sm:text-2xl">
                {metric.value}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 sm:text-[12px]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Accuracy trend</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          <ProgressChart data={TREND} className="max-w-2xl" />
        </div>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>By subject</h2>
        <div className={`${CARD} mt-3 divide-y divide-slate-100 overflow-hidden`}>
          {PRACTICE_SUBJECTS.map((subject) => (
            <div key={subject.id} className="flex items-center gap-4 px-5 py-4">
              <span className="w-36 shrink-0 text-sm font-medium text-dark">{subject.name}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${subject.accuracy}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[13px] font-medium text-slate-600">
                {subject.accuracy}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

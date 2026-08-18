import { FiZap } from "react-icons/fi";

import { CARD, SECTION_TITLE } from "@/components/app/ui";
import { getExamStats } from "@/lib/exam-data";

export default async function InsightsPage() {
  const stats = await getExamStats();
  const hasPractice = stats.totalAnswered > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">AI Insights</h1>
        <p className="mt-1 text-sm text-slate-500">
          Analysis of your performance, updated as you practice.
        </p>
      </div>

      <section className={`${CARD} p-5 sm:p-6`}>
        <div className="flex items-center gap-2">
          <FiZap className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-dark">Latest insight</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {hasPractice
            ? "Insights are being generated from your practice history."
            : "No insights yet — answer some questions and AI analysis will appear here."}
        </p>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Recent insights</h2>
        <div className={`${CARD} mt-3 p-8 text-center text-sm text-slate-500`}>
          {hasPractice
            ? "Your latest analysis will be listed here."
            : "Start practicing to build up your analysis history."}
        </div>
      </section>
    </div>
  );
}

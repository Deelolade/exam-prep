import Link from "next/link";
import { FiArrowRight, FiZap } from "react-icons/fi";

import { BTN_GOLD, CARD, SECTION_TITLE } from "@/components/app/ui";
import { AI_INSIGHT } from "@/data/study";

const RECENT_INSIGHTS = [
  {
    title: "Weak areas detected",
    detail: "Probability and algebra in Mathematics are dragging your accuracy below 70%.",
  },
  {
    title: "Consistency is paying off",
    detail: "Practicing 4 days in a row has improved your average accuracy by 6 points.",
  },
  {
    title: "Time management",
    detail: "You're 20% slower on Physics questions — try a timed session this week.",
  },
];

export default function InsightsPage() {
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
        <p className="mt-3 text-sm leading-6 text-slate-600">{AI_INSIGHT.headline}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-dark">Recommendation: </span>
          {AI_INSIGHT.recommendation}
        </p>
        <Link href="/practice" className={`${BTN_GOLD} mt-5`}>
          Practice weak areas
          <FiArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Recent insights</h2>
        <div className="mt-3 space-y-3">
          {RECENT_INSIGHTS.map((insight) => (
            <div key={insight.title} className={`${CARD} p-5`}>
              <p className="text-sm font-semibold text-dark">{insight.title}</p>
              <p className="mt-1 text-[13px] leading-6 text-slate-500">{insight.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { CARD } from "@/components/app/ui";
import { PRACTICE_SUBJECTS } from "@/data/study";

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Practice</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a subject and start answering CBT-style questions.
        </p>
      </div>

      <div className={`${CARD} divide-y divide-slate-100 overflow-hidden`}>
        {PRACTICE_SUBJECTS.map((subject) => (
          <div key={subject.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-dark">{subject.name}</p>
              <p className="mt-0.5 text-[13px] text-slate-500">
                {subject.questions} questions · ~{subject.minutes} min · {subject.accuracy}%
                accuracy
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Start practice
              <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { FiArrowRight, FiCalendar, FiPlus } from "react-icons/fi";

import { BTN_GOLD, BTN_OUTLINE, CARD } from "@/components/app/ui";
import { MY_EXAMS, formatDateShort } from "@/data/study";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-dark">My Exams</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the exams you&apos;re preparing for.
          </p>
        </div>
        <Link href="/exams/new" className={BTN_GOLD}>
          <FiPlus className="w-4 h-4" aria-hidden="true" />
          Add exam
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MY_EXAMS.map((exam) => (
          <div key={exam.id} className={`${CARD} flex flex-col p-5`}>
            <h2 className="text-lg font-semibold tracking-tight text-dark">{exam.name}</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">{exam.subjects.join(" + ")}</p>

            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-slate-500">
              <FiCalendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              Exam date: {formatDateShort(exam.examDate)}
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Progress</span>
                <span className="font-medium text-dark">{exam.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${exam.progress}%` }}
                />
              </div>
            </div>

            <Link href="/" className={`${BTN_OUTLINE} mt-5 w-full`}>
              Continue
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        ))}

        {/* Add exam */}
        <Link
          href="/exams/new"
          className="flex min-h-[180px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary transition"
        >
          <FiPlus className="w-4 h-4" aria-hidden="true" />
          Add exam
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { FiArrowRight, FiPlus } from "react-icons/fi";

import { BTN_GOLD, CARD } from "@/components/app/ui";
import { getExamStats, getUserExams } from "@/lib/exam-data";

export default async function PracticePage() {
  const [exams, stats] = await Promise.all([getUserExams(), getExamStats()]);
  const activeExam = exams[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Practice</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a subject and start answering CBT-style questions.
        </p>
      </div>

      {!activeExam || activeExam.subjects.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-4 p-10 text-center`}>
          <p className="text-sm font-medium text-dark">No practice subjects yet</p>
          <p className="max-w-sm text-sm text-slate-500">
            Create an exam and pick subjects to build your practice plan.
          </p>
          <Link href="/exams/new" className={BTN_GOLD}>
            <FiPlus className="w-4 h-4" aria-hidden="true" />
            Create exam
          </Link>
        </div>
      ) : (
        <div className={`${CARD} divide-y divide-slate-100 overflow-hidden`}>
          {activeExam.subjects.map((subject) => {
            const subjectStats = subject.code ? stats.questionsBySubject[subject.code] : undefined;
            const questionCount = subjectStats?.total ?? 0;
            const accuracy =
              subjectStats && subjectStats.answered > 0
                ? Math.round((subjectStats.correct / subjectStats.answered) * 100)
                : null;

            return (
              <div key={subject.name} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-dark">{subject.name}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    {questionCount > 0 ? `${questionCount} questions` : "No question bank yet"}
                    {accuracy !== null ? ` · ${accuracy}% accuracy` : ""}
                  </p>
                </div>
                <Link
                  href={`/exams/${activeExam.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Start practice
                  <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { FiArrowRight, FiCalendar, FiPlus } from "react-icons/fi";

import DeleteExamButton from "@/components/app/delete-exam-button";
import { BTN_GOLD, BTN_OUTLINE, CARD } from "@/components/app/ui";
import { formatDateShort } from "@/data/study";
import { examProgress, getExamStats, getUserExams } from "@/lib/exam-data";

export default async function ExamsPage() {
  const [exams, stats] = await Promise.all([getUserExams(), getExamStats()]);

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

      {exams.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center gap-4 p-10 text-center`}>
          <p className="text-sm font-medium text-dark">No exams yet</p>
          <p className="max-w-sm text-sm text-slate-500">
            Create your first preparation plan — pick an exam, choose your subjects, and set a
            study schedule.
          </p>
          <Link href="/exams/new" className={BTN_GOLD}>
            <FiPlus className="w-4 h-4" aria-hidden="true" />
            Create your first exam
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {exams.map((exam) => {
            const progress = examProgress(exam, stats);
            const subjectNames = exam.subjects.map((s) => s.name).join(" + ");
            return (
              <div key={exam.id} className={`${CARD} flex flex-col p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold tracking-tight text-dark">{exam.name}</h2>
                    <p className="mt-0.5 text-[13px] text-slate-500">{subjectNames}</p>
                  </div>
                  <DeleteExamButton examId={exam.id} examName={exam.name} />
                </div>

                <p className="mt-4 flex items-center gap-1.5 text-[13px] text-slate-500">
                  <FiCalendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  {exam.exam_date ? `Exam date: ${formatDateShort(exam.exam_date)}` : "No exam date set"}
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-dark">{progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Link href={`/exams/${exam.id}`} className={`${BTN_OUTLINE} mt-5 w-full`}>
                  Continue
                  <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            );
          })}

          <Link
            href="/exams/new"
            className="flex min-h-[180px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary transition"
          >
            <FiPlus className="w-4 h-4" aria-hidden="true" />
            Add exam
          </Link>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";

import Exam from "@/components/exam/exam";
import { BTN_OUTLINE, CARD } from "@/components/app/ui";
import { getExamById, getExamContent } from "@/lib/exam-data";

export default async function ExamPracticePage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;

  const exam = await getExamById(examId);
  if (!exam) {
    redirect("/exams");
  }

  const { sections, questions } = await getExamContent();

  const codes = new Set(
    exam.subjects.map((s) => s.code).filter((c): c is string => c !== null),
  );

  const examQuestions = questions.filter((q) => codes.has(q.section));
  const examSections = sections
    .filter((s) => codes.has(s.code))
    .map((s) => ({
      ...s,
      count: examQuestions.filter((q) => q.section === s.code).length,
    }));

  if (examQuestions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className={`${CARD} w-full max-w-sm p-10 text-center`}>
          <p className="text-base font-semibold text-dark">No questions for this exam yet</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your selected subjects don&apos;t have a question bank yet.
          </p>
          <Link href="/exams" className={`${BTN_OUTLINE} mt-6`}>
            Back to exams
          </Link>
        </div>
      </div>
    );
  }

  return <Exam sections={examSections} questions={examQuestions} examName={exam.name} />;
}

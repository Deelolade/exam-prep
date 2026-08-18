import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FiLoader } from "react-icons/fi";

import Exam from "@/components/exam/exam";
import { BTN_OUTLINE, CARD } from "@/components/app/ui";
import RetryGenerateButton from "@/components/app/retry-generate-button";
import type { StoredExam } from "@/lib/exam-data";
import {
  ensureExamQuestions,
  getExamById,
  getSubjectSections,
} from "@/lib/exam-data";

function GeneratingState({ examName }: { examName: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className={`${CARD} w-full max-w-sm p-10 text-center`}>
        <FiLoader className="mx-auto h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-4 text-base font-semibold text-dark">Preparing your practice questions</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Generating a fresh AI question set for {examName} — one batch per subject. This can take
          a minute on the first attempt.
        </p>
      </div>
    </div>
  );
}

async function ExamContent({ exam }: { exam: StoredExam }) {
  let questions = null;

  try {
    questions = await ensureExamQuestions(exam);
  } catch (error) {
    console.error("Failed to prepare exam questions:", error);
    questions = null;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className={`${CARD} w-full max-w-sm p-10 text-center`}>
          <p className="text-base font-semibold text-dark">Couldn&apos;t prepare questions</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Question generation failed for {exam.name}. Make sure your selected subjects have a
            question bank, then try again.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <RetryGenerateButton examId={exam.id} />
            <Link href="/exams" className={`${BTN_OUTLINE} w-full`}>
              Back to exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const codes = new Set(
    exam.subjects.map((s) => s.code).filter((c): c is string => c !== null),
  );

  const sections = (await getSubjectSections())
    .filter((s) => codes.has(s.code))
    .map((s) => ({
      ...s,
      count: questions.filter((q) => q.section === s.code).length,
    }));

  return <Exam sections={sections} questions={questions} examName={exam.name} />;
}

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

  return (
    <Suspense fallback={<GeneratingState examName={exam.name} />}>
      <ExamContent exam={exam} />
    </Suspense>
  );
}

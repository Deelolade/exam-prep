import { redirect } from "next/navigation";

import ExamWizard from "@/components/app/exam-wizard";
import { getExamById } from "@/lib/exam-data";

export default async function EditExamPage({
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Edit exam</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update {exam.name} — exam details, subjects, and study schedule.
        </p>
      </div>
      <ExamWizard initialExam={exam} />
    </div>
  );
}

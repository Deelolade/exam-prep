import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";
import { ensureExamQuestions, getExamById } from "@/lib/exam-data";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> },
) {
  const { examId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exam = await getExamById(examId); // RLS-scoped to the signed-in user
  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  try {
    const questions = await ensureExamQuestions(exam);
    return NextResponse.json({ count: questions?.length ?? 0 });
  } catch (err) {
    console.error("Failed to generate exam questions:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Question generation failed" },
      { status: 500 },
    );
  }
}

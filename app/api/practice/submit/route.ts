import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";
import { getExamById } from "@/lib/exam-data";

type SubmittedAnswer = {
  question_id: string;
  selected_index: number;
};

/**
 * Saves a completed practice attempt: one practice_answers row per answered
 * question plus one practice_sessions row with the overall score.
 * Correctness is recomputed server-side from the stored options — the client
 * only reports which option was picked.
 */
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const examId: unknown = body?.exam_id;
  const submittedAnswers: unknown = body?.answers;

  if (typeof examId !== "string" || examId.length === 0) {
    return NextResponse.json({ error: "exam_id is required" }, { status: 400 });
  }
  if (!Array.isArray(submittedAnswers)) {
    return NextResponse.json({ error: "answers must be an array" }, { status: 400 });
  }

  const exam = await getExamById(examId); // RLS-scoped to the signed-in user
  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  // Keep the last answer per question, drop anything malformed.
  const byQuestion = new Map<string, number>();
  for (const raw of submittedAnswers) {
    const answer = raw as SubmittedAnswer;
    if (
      typeof answer?.question_id === "string" &&
      Number.isInteger(answer.selected_index) &&
      answer.selected_index >= 0
    ) {
      byQuestion.set(answer.question_id, answer.selected_index);
    }
  }
  if (byQuestion.size === 0) {
    return NextResponse.json({ error: "No valid answers provided" }, { status: 400 });
  }

  // Only accept questions that actually belong to this exam, and grade them
  // against the stored options.
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, options")
    .eq("exam_id", examId)
    .in("id", [...byQuestion.keys()]);

  if (questionsError) {
    console.error("Failed to fetch exam questions for grading:", questionsError);
    return NextResponse.json({ error: "Failed to grade answers" }, { status: 500 });
  }

  const optionsById = new Map(
    (questions ?? []).map((q) => [q.id, q.options as { c: boolean }[]]),
  );

  const answerRows: {
    user_id: string;
    question_id: string;
    selected_index: number;
    is_correct: boolean;
  }[] = [];
  for (const [questionId, selectedIndex] of byQuestion) {
    const options = optionsById.get(questionId);
    if (!options || selectedIndex >= options.length) continue;
    answerRows.push({
      user_id: user.id,
      question_id: questionId,
      selected_index: selectedIndex,
      is_correct: options[selectedIndex].c,
    });
  }

  if (answerRows.length === 0) {
    return NextResponse.json({ error: "No valid answers provided" }, { status: 400 });
  }

  const correct = answerRows.filter((a) => a.is_correct).length;
  const total = answerRows.length;
  const scorePercent = Math.round((correct / total) * 100);

  const { error: answersError } = await supabase.from("practice_answers").insert(answerRows);
  if (answersError) {
    console.error("Failed to save practice answers:", answersError);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }

  const { data: session, error: sessionError } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: user.id,
      exam_id: examId,
      total_questions: total,
      correct_answers: correct,
      score_percent: scorePercent,
    })
    .select()
    .single();

  if (sessionError) {
    // Answers are already saved; the session row is what powers score history.
    console.error("Failed to save practice session:", sessionError);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }

  return NextResponse.json({ session }, { status: 201 });
}

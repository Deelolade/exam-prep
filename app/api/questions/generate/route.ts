import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";
import { createAdminClient } from "@/lib/server-admin";
import { generateQuestions } from "@/lib/ai/generate-questions";
import { getAiModel } from "@/utils/env";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

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
  const subjectCode: unknown = body?.subject_code;
  const countRaw: unknown = body?.count;
  const difficulty: unknown = body?.difficulty;
  const examType: unknown = body?.exam_type;

  if (typeof subjectCode !== "string" || subjectCode.trim().length === 0) {
    return NextResponse.json({ error: "subject_code is required" }, { status: 400 });
  }

  const count =
    typeof countRaw === "number" && Number.isFinite(countRaw)
      ? Math.min(Math.max(Math.round(countRaw), 1), 10)
      : 5;

  const admin = createAdminClient();

  // Validate the subject exists and grab its name for the prompt.
  const { data: subject, error: subjectError } = await admin
    .from("subjects")
    .select("code, name")
    .eq("code", subjectCode.trim())
    .maybeSingle();

  if (subjectError || !subject) {
    return NextResponse.json({ error: "Unknown subject_code" }, { status: 400 });
  }

  let questions;
  try {
    questions = await generateQuestions({
      subjectCode: subject.code,
      subjectName: subject.name,
      count,
      difficulty: DIFFICULTIES.includes(difficulty as (typeof DIFFICULTIES)[number])
        ? (difficulty as (typeof DIFFICULTIES)[number])
        : undefined,
      examType: typeof examType === "string" ? examType : undefined,
    });
  } catch (err) {
    console.error("Question generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Question generation failed" },
      { status: 500 },
    );
  }

  // Append after the highest sort_order for this subject.
  const { data: maxRow } = await admin
    .from("questions")
    .select("sort_order")
    .eq("subject_code", subject.code)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const baseOrder = (maxRow?.sort_order ?? -1) + 1;

  const { data: inserted, error: insertError } = await admin
    .from("questions")
    .insert(
      questions.map((q, i) => ({
        subject_code: q.section,
        question: q.q,
        passage: q.passage ?? null,
        hint: q.hint,
        options: q.options,
        source: "ai",
        model: getAiModel(),
        sort_order: baseOrder + i,
      })),
    )
    .select("id");

  if (insertError) {
    console.error("Failed to persist questions:", insertError);
    return NextResponse.json({ error: "Failed to save questions" }, { status: 500 });
  }

  return NextResponse.json({ created: inserted.length, questions });
}

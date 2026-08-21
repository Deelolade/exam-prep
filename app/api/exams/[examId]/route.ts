import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";
import { createAdminClient } from "@/lib/server-admin";
import { getExamById, resolveSubjectCodes } from "@/lib/exam-data";

export async function DELETE(
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

  // RLS restricts this to the signed-in user's own exams; the explicit
  // user_id filter is belt-and-suspenders.
  const { error: deleteError } = await supabase
    .from("exams")
    .delete()
    .eq("id", examId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Failed to delete exam:", deleteError);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
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

  const exam = await getExamById(examId);
  if (!exam) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const name: unknown = body?.name;
  const institution: unknown = body?.institution;
  const examDate: unknown = body?.exam_date;
  const dailyMinutes: unknown = body?.daily_minutes;
  const level: unknown = body?.level;
  const subjectNames: unknown = body?.subjects;

  let subjects: { code: string | null; name: string }[] | undefined;
  if (subjectNames !== undefined) {
    if (!Array.isArray(subjectNames) || subjectNames.length === 0) {
      return NextResponse.json({ error: "Pick at least one subject" }, { status: 400 });
    }
    subjects = await resolveSubjectCodes(
      subjectNames.filter((s): s is string => typeof s === "string"),
    );
  }

  const patch: Record<string, unknown> = {};
  if (typeof name === "string" && name.trim()) patch.name = name.trim();
  if (subjects) patch.subjects = subjects;
  if (typeof institution === "string") patch.institution = institution.trim() || null;
  if (typeof examDate === "string") patch.exam_date = examDate || null;
  if (typeof dailyMinutes === "number" && Number.isFinite(dailyMinutes)) {
    patch.daily_minutes = dailyMinutes;
  }
  if (typeof level === "string") patch.level = level || null;

  const { data: updated, error: updateError } = await supabase
    .from("exams")
    .update(patch)
    .eq("id", examId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError) {
    console.error("Failed to update exam:", updateError);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }

  // Drop generated questions for subjects that are no longer part of the exam.
  if (subjects) {
    const admin = createAdminClient();
    const keepCodes = subjects
      .map((s) => s.code)
      .filter((c): c is string => c !== null);

    let query = admin.from("questions").delete().eq("exam_id", examId);
    if (keepCodes.length > 0) {
      query = query.not("subject_code", "in", keepCodes);
    }
    const { error: deleteError } = await query;
    if (deleteError) {
      console.error("Failed to prune exam questions:", deleteError);
    }
  }

  return NextResponse.json({ exam: updated });
}

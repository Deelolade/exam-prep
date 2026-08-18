import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error: queryError } = await supabase
    .from("exams")
    .select("*")
    .order("created_at", { ascending: false });

  if (queryError) {
    console.error("Failed to fetch exams:", queryError);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }

  return NextResponse.json({ exams: data ?? [] });
}

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
  const name: unknown = body?.name;
  const institution: unknown = body?.institution;
  const examDate: unknown = body?.exam_date;
  const dailyMinutes: unknown = body?.daily_minutes;
  const level: unknown = body?.level;
  const subjectNames: unknown = body?.subjects;

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!Array.isArray(subjectNames) || subjectNames.length === 0) {
    return NextResponse.json({ error: "Pick at least one subject" }, { status: 400 });
  }

  // Resolve known subject names to their codes so question banks can be
  // mapped later; custom subjects keep code null.
  const { data: knownSubjects } = await supabase
    .from("subjects")
    .select("code, name")
    .in("name", subjectNames.filter((s): s is string => typeof s === "string"));

  const known = new Map((knownSubjects ?? []).map((s) => [s.name, s.code]));
  const subjects = subjectNames
    .filter((s): s is string => typeof s === "string")
    .map((subjectName) => ({
      code: known.get(subjectName) ?? null,
      name: subjectName,
    }));

  const dailyMinutesNumber =
    typeof dailyMinutes === "number" && Number.isFinite(dailyMinutes) ? dailyMinutes : null;

  const { data: exam, error: insertError } = await supabase
    .from("exams")
    .insert({
      user_id: user.id,
      name: name.trim(),
      institution: typeof institution === "string" && institution.trim() ? institution.trim() : null,
      exam_date: typeof examDate === "string" && examDate ? examDate : null,
      daily_minutes: dailyMinutesNumber,
      level: typeof level === "string" && level ? level : null,
      subjects,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to create exam:", insertError);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }

  return NextResponse.json({ exam }, { status: 201 });
}

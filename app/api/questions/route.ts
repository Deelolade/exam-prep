import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const subjectCode = searchParams.get("subject_code");
  const limitRaw = searchParams.get("limit");

  let query = supabase
    .from("questions")
    .select("id, subject_code, question, passage, hint, options, source, sort_order")
    .order("sort_order");

  if (subjectCode) {
    query = query.eq("subject_code", subjectCode);
  }

  if (limitRaw) {
    const limit = parseInt(limitRaw, 10);
    if (!Number.isNaN(limit) && limit > 0 && limit <= 100) {
      query = query.limit(limit);
    }
  }

  const { data, error: queryError } = await query;

  if (queryError) {
    console.error("Failed to fetch questions:", queryError);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }

  return NextResponse.json({ questions: data ?? [] });
}

import { NextResponse } from "next/server";

import { createClient } from "@/lib/server";

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

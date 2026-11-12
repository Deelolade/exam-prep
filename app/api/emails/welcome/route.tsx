import { NextResponse } from "next/server";
import { render } from "react-email";
import WelcomeEmail from "@/emails/welcome-email";
import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/server";
import { APP_URL } from "@/utils/env";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const email: unknown = body?.email;

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Prevent sending welcome emails to arbitrary third-party email addresses
  if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
    return NextResponse.json(
      { error: "Forbidden: destination email does not match account" },
      { status: 403 },
    );
  }

  const appUrl = APP_URL ?? new URL(request.url).origin;
  const html = await render(<WelcomeEmail appUrl={appUrl} />);

  try {
    await sendEmail({
      to: email.trim(),
      subject: "Welcome to ExamPrep.run",
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { render } from "react-email";
import WelcomeEmail from "@/emails/welcome-email";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email: unknown = body?.email;

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const html = await render(<WelcomeEmail appUrl={appUrl} />);

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to ExamPrep.run",
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}

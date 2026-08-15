import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiCalendar, FiMail } from "react-icons/fi";

import { createClient } from "@/lib/server";
import { LogoutButton } from "@/components/logout-button";

type Profile = {
  email?: string | null;
  full_name?: string | null;
  created_at?: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch the stored profile. Gracefully fall back if the `profiles` table
  // hasn't been created yet (see supabase/migrations/0001_create_profiles.sql).
  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name, created_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = data as Profile | null;
  } catch {
    profile = null;
  }

  const email = profile?.email ?? user.email;
  const createdAt = profile?.created_at ?? user.created_at;

  return (
    <div className="min-h-svh bg-surface">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <span className="font-sans text-lg font-semibold tracking-tight text-dark">
            ExamPrep<span className="text-primary">.run</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:inline">{email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10">
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-dark">
          {profile?.full_name ? `Welcome back, ${profile.full_name}` : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {email} {createdAt && `· member since ${new Date(createdAt).toLocaleDateString()}`}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-8">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-dark">Account</h2>
            <dl className="mt-4 space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiCalendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {createdAt
                    ? `Member since ${new Date(createdAt).toLocaleDateString()}`
                    : "Account active"}
                </span>
              </div>
            </dl>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
            <h2 className="text-sm font-semibold text-dark">Practice</h2>
            <p className="text-sm text-slate-500 mt-2">
              Resume the CBT screening practice set — 50 questions across six sections with instant
              explanations.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-white rounded-lg h-11 px-5 text-sm font-semibold hover:bg-blue-600 transition"
            >
              Start practicing
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

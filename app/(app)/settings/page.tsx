import { redirect } from "next/navigation";
import { FiMail } from "react-icons/fi";

import { createClient } from "@/lib/server";
import { getUserExams } from "@/lib/exam-data";
import { LogoutButton } from "@/components/logout-button";
import { CARD, SECTION_TITLE } from "@/components/app/ui";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const exams = await getUserExams();
  const activeExam = exams[0];

  const dailyMinutes = activeExam?.daily_minutes;
  const dailyTimeLabel = dailyMinutes
    ? dailyMinutes >= 60
      ? `${dailyMinutes / 60} ${dailyMinutes === 60 ? "hour" : "hours"}`
      : `${dailyMinutes} minutes`
    : "30 minutes";

  const levelLabel = activeExam?.level ?? "Intermediate";
  const activeExamLabel = activeExam
    ? activeExam.institution
      ? `${activeExam.name} (${activeExam.institution})`
      : activeExam.name
    : "Universal CBT Practice";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and study preferences.</p>
      </div>

      <section>
        <h2 className={SECTION_TITLE}>Account</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <FiMail className="w-4 h-4 text-primary" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-dark">{user.email}</p>
                <p className="text-[12px] text-slate-500">Signed in account</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Study preferences</h2>
        <div className={`${CARD} mt-3 divide-y divide-slate-100`}>
          {[
            { label: "Daily study time", value: dailyTimeLabel },
            { label: "Study days", value: "Mon – Sun" },
            { label: "Current level", value: levelLabel },
            { label: "Active exam", value: activeExamLabel },
            {
              label: "Institution",
              value: activeExam?.institution ?? "Universal (All institutions)",
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">{row.label}</span>
              <span className="text-sm font-medium text-dark">{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

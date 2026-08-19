import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiCalendar, FiPlus, FiZap } from "react-icons/fi";

import { createClient } from "@/lib/server";
import ProgressChart from "@/components/app/progress-chart";
import { BTN_DARK, BTN_GOLD, CARD, SECTION_TITLE } from "@/components/app/ui";
import { daysUntil, formatDate } from "@/data/study";
import { examProgress, getExamStats, getUserExams } from "@/lib/exam-data";

function greetingName(email?: string): string {
  const local = (email ?? "").split("@")[0].replace(/[._-]+/g, " ").trim();
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  const [exams, stats] = await Promise.all([getUserExams(), getExamStats()]);
  const activeExam = exams[0];

  let profileName: string | undefined;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .maybeSingle();
    profileName = data?.full_name ?? data?.username ?? undefined;
  } catch {
    profileName = undefined;
  }

  const name = profileName ?? greetingName(user.email);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const overallAccuracy =
    stats.totalAnswered > 0 ? Math.round((stats.overallCorrect / stats.totalAnswered) * 100) : null;

  const subjectsPracticed = Object.values(stats.questionsBySubject).filter(
    (s) => s.answered > 0,
  ).length;

  const chartMax = Math.max(...stats.answersByDay.map((d) => d.value), 1);
  const hasPractice = stats.totalAnswered > 0;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">
          {greeting}
          {name && `, ${name}`}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Let&apos;s get you ready for your next exam.</p>
      </div>

      {/* Active exam */}
      {activeExam ? (
        <section className="rounded-xl bg-dark p-6 text-white sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Active exam
              </p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{activeExam.name}</h2>
              <p className="text-sm text-white/60">
                {activeExam.subjects.map((s) => s.name).join(" + ") ||
                  activeExam.institution ||
                  "No subjects selected"}
              </p>
              <div className="mt-4 flex items-center gap-4 text-[13px] text-white/70">
                {activeExam.exam_date && (
                  <>
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />
                      {formatDate(activeExam.exam_date)}
                    </span>
                    <span className="text-white/35" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-medium text-white">
                      {daysUntil(activeExam.exam_date)}{" "}
                      {daysUntil(activeExam.exam_date) === 1 ? "day" : "days"} remaining
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-2xl font-semibold tracking-tight text-primary">
                {examProgress(activeExam, stats)}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-white/40">
                Preparation progress
              </span>
            </div>
          </div>

          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${examProgress(activeExam, stats)}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/exams/${activeExam.id}`} className={BTN_GOLD}>
              Continue practice
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link href="/exams" className={BTN_DARK}>
              View exam
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-xl bg-dark p-6 text-white sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight">You haven&apos;t created an exam yet</h2>
          <p className="mt-2 max-w-md text-sm text-white/60">
            Set up your first preparation plan — exam, subjects, and study schedule — to get
            started.
          </p>
          <Link href="/exams/new" className={`${BTN_GOLD} mt-5`}>
            <FiPlus className="w-4 h-4" aria-hidden="true" />
            Create exam
          </Link>
        </section>
      )}

      {/* Today's practice */}
      <section>
        <h2 className={SECTION_TITLE}>Today&apos;s practice</h2>
        {activeExam && activeExam.subjects.length > 0 ? (
          <div className={`${CARD} mt-3 divide-y divide-slate-100 overflow-hidden`}>
            {activeExam.subjects.map((subject) => {
              const subjectStats = subject.code ? stats.questionsBySubject[subject.code] : undefined;
              const questionCount = subjectStats?.total ?? 0;
              const accuracy =
                subjectStats && subjectStats.answered > 0
                  ? Math.round((subjectStats.correct / subjectStats.answered) * 100)
                  : null;

              return (
                <div key={subject.name} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-dark">{subject.name}</p>
                    <p className="mt-0.5 text-[13px] text-slate-500">
                      {questionCount > 0
                        ? `${questionCount} questions`
                        : "No question bank yet"}
                      {accuracy !== null ? ` · ${accuracy}% accuracy` : ""}
                    </p>
                  </div>
                  <Link
                    href={`/exams/${activeExam.id}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-dark hover:text-primary transition"
                  >
                    Practice
                    <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`${CARD} mt-3 p-6 text-sm text-slate-500`}>
            Pick subjects for an exam to see today&apos;s practice here.
          </div>
        )}
      </section>

      {/* Progress */}
      <section>
        <h2 className={SECTION_TITLE}>Your progress</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          {hasPractice ? (
            <>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                {[
                  { label: "Questions answered", value: String(stats.totalAnswered) },
                  { label: "Accuracy", value: overallAccuracy !== null ? `${overallAccuracy}%` : "—" },
                  { label: "Subjects practiced", value: String(subjectsPracticed) },
                ].map((metric) => (
                  <div key={metric.label} className="px-4 first:pl-0 last:pr-0 sm:px-6">
                    <p className="text-lg font-semibold tracking-tight text-dark sm:text-xl">
                      {metric.value}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500 sm:text-[12px]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-[13px] font-medium text-slate-600">Answers — last 7 days</p>
                <ProgressChart data={stats.answersByDay} max={chartMax} className="mt-4" />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No practice yet. Answer a few questions and your progress will show up here.
            </p>
          )}
        </div>
      </section>

      {/* AI study insight */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <div className="flex items-center gap-2">
          <FiZap className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-dark">AI study insight</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {hasPractice
            ? "Insights will appear here as your practice history grows."
            : "Practice more to unlock personalized insights about your performance."}
        </p>
      </section>
    </div>
  );
}

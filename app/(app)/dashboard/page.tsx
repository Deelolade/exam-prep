import Link from "next/link";
import { redirect } from "next/navigation";
import { FiArrowRight, FiCalendar, FiZap } from "react-icons/fi";

import { createClient } from "@/lib/server";
import ProgressChart from "@/components/app/progress-chart";
import { BTN_DARK, BTN_GOLD, CARD, SECTION_TITLE } from "@/components/app/ui";
import {
  ACTIVE_EXAM,
  AI_INSIGHT,
  METRICS,
  TODAYS_PRACTICE,
  TREND,
  daysUntil,
  formatDate,
} from "@/data/study";

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

  const name = greetingName(user.email);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const daysLeft = daysUntil(ACTIVE_EXAM.examDate);

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
      <section className="rounded-xl bg-dark p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Active exam
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{ACTIVE_EXAM.name}</h2>
            <p className="text-sm text-white/60">{ACTIVE_EXAM.programme}</p>
            <div className="mt-4 flex items-center gap-4 text-[13px] text-white/70">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />
                {formatDate(ACTIVE_EXAM.examDate)}
              </span>
              <span className="text-white/35" aria-hidden="true">
                ·
              </span>
              <span className="font-medium text-white">
                {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-2xl font-semibold tracking-tight text-primary">
              {ACTIVE_EXAM.progress}%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-white/40">
              Preparation progress
            </span>
          </div>
        </div>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${ACTIVE_EXAM.progress}%` }}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className={BTN_GOLD}>
            Continue practice
            <FiArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link href="/exams" className={BTN_DARK}>
            View exam
          </Link>
        </div>
      </section>

      {/* Today's practice */}
      <section>
        <h2 className={SECTION_TITLE}>Today&apos;s practice</h2>
        <div className={`${CARD} mt-3 divide-y divide-slate-100 overflow-hidden`}>
          {TODAYS_PRACTICE.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-dark">{subject.name}</p>
                <p className="mt-0.5 text-[13px] text-slate-500">
                  {subject.questions} questions · ~{subject.minutes} min
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden text-[13px] font-medium text-slate-500 sm:block">
                  {subject.accuracy}% accuracy
                </span>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-dark hover:text-primary transition"
                >
                  Practice
                  <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress */}
      <section>
        <h2 className={SECTION_TITLE}>Your progress</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {METRICS.map((metric) => (
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
            <p className="text-[13px] font-medium text-slate-600">
              Accuracy — last 7 days
            </p>
            <ProgressChart data={TREND} className="mt-4" />
          </div>
        </div>
      </section>

      {/* AI study insight */}
      <section className={`${CARD} p-5 sm:p-6`}>
        <div className="flex items-center gap-2">
          <FiZap className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-dark">AI study insight</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{AI_INSIGHT.headline}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-dark">Recommendation: </span>
          {AI_INSIGHT.recommendation}
        </p>
        <Link href="/practice" className={`${BTN_GOLD} mt-5`}>
          Practice weak areas
          <FiArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

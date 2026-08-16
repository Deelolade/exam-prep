"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { BTN_GOLD, BTN_OUTLINE, CARD, INPUT, LABEL } from "@/components/app/ui";
import {
  LEVELS,
  POPULAR_EXAMS,
  RECOMMENDED_FOCUS,
  STUDY_DAYS,
  STUDY_TIME_OPTIONS,
  SUBJECT_OPTIONS,
  daysUntil,
} from "@/data/study";

const STEPS = ["Exam", "Subjects", "Study time", "Summary"];

export default function NewExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1
  const [exam, setExam] = useState("");
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState({ name: "", institution: "", date: "" });

  // Step 2
  const [subjects, setSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");

  // Step 3
  const [time, setTime] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [level, setLevel] = useState("");

  const filteredExams = POPULAR_EXAMS.filter((e) =>
    e.toLowerCase().includes(search.toLowerCase()),
  );

  const examName = exam === "Custom exam" ? custom.name : exam;
  const examDate = exam === "Custom exam" ? custom.date : "";

  const stepValid =
    step === 0
      ? examName.trim().length > 0
      : step === 1
        ? subjects.length > 0
        : step === 2
          ? time.length > 0
          : true;

  const toggleSubject = (subject: string) =>
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    );

  const addCustomSubject = () => {
    const value = customSubject.trim();
    if (!value) return;
    if (!subjects.includes(value)) setSubjects((prev) => [...prev, value]);
    setCustomSubject("");
  };

  const toggleDay = (day: string) =>
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const next = () => {
    if (!stepValid) {
      toast.error(step === 0 ? "Select an exam first" : step === 1 ? "Pick at least one subject" : "Choose a study time");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    toast.success("Preparation plan created", {
      description: `${examName} is ready. Your personalized practice plan will guide you.`,
    });
    router.push("/exams");
  };

  const hoursPerDay =
    time === "Custom"
      ? Math.round((parseInt(customMinutes, 10) || 0) / 60)
      : time === "15 minutes"
        ? 0.25
        : time === "30 minutes"
          ? 0.5
          : time === "1 hour"
            ? 1
            : time === "2 hours"
              ? 2
              : 0;

  const daysLabel = examDate ? `${daysUntil(examDate)} days` : "—";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-dark text-white",
                  !done && !active && "bg-slate-200 text-slate-500",
                )}
              >
                {done ? <FiCheck className="w-3 h-3" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[12px] font-medium sm:block",
                  active ? "text-dark" : "text-slate-400",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      {/* Step 1 — Exam */}
      {step === 0 && (
        <div className={`${CARD} mt-8 p-6`}>
          <h1 className="text-xl font-semibold tracking-tight text-dark">
            What exam are you preparing for?
          </h1>

          <div className="relative mt-5">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exams"
              className={cn(INPUT, "pl-9")}
            />
          </div>

          <p className={cn(LABEL, "mt-6")}>Popular exams</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {filteredExams.map((option) => {
              const selected = exam === option;
              return (
                <button
                  key={option}
                  onClick={() => setExam(option)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary/10 text-dark"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {option}
                  {selected && <FiCheck className="w-4 h-4 text-primary" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {exam === "Custom exam" && (
            <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor="custom-name" className={LABEL}>
                    Exam name
                  </label>
                  <input
                    id="custom-name"
                    type="text"
                    value={custom.name}
                    onChange={(e) => setCustom({ ...custom, name: e.target.value })}
                    placeholder="e.g. LASU PostUTME"
                    className={INPUT}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="custom-institution" className={LABEL}>
                    Institution
                  </label>
                  <input
                    id="custom-institution"
                    type="text"
                    value={custom.institution}
                    onChange={(e) => setCustom({ ...custom, institution: e.target.value })}
                    placeholder="e.g. Lagos State University"
                    className={INPUT}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="custom-date" className={LABEL}>
                  Exam date
                </label>
                <input
                  id="custom-date"
                  type="date"
                  value={custom.date}
                  onChange={(e) => setCustom({ ...custom, date: e.target.value })}
                  className={INPUT}
                />
              </div>
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button onClick={next} className={BTN_GOLD}>
              Continue
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Subjects */}
      {step === 1 && (
        <div className={`${CARD} mt-8 p-6`}>
          <h1 className="text-xl font-semibold tracking-tight text-dark">
            What do you want to practice?
          </h1>

          <div className="mt-5 grid gap-2">
            {SUBJECT_OPTIONS.map((subject) => {
              const selected = subjects.includes(subject);
              return (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary/10 text-dark"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {subject}
                  {selected && <FiCheck className="w-4 h-4 text-primary" aria-hidden="true" />}
                </button>
              );
            })}

            {subjects
              .filter((s) => !SUBJECT_OPTIONS.includes(s))
              .map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className="flex items-center justify-between rounded-lg border border-primary bg-primary/10 px-3.5 py-2.5 text-sm font-medium text-dark"
                >
                  {subject}
                  <FiCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                </button>
              ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSubject();
                }
              }}
              placeholder="Add custom subject"
              className={INPUT}
            />
            <button
              onClick={addCustomSubject}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <FiPlus className="w-4 h-4" aria-hidden="true" />
              Add
            </button>
          </div>

          <div className="mt-7 flex justify-between">
            <button onClick={back} className={BTN_OUTLINE}>
              <FiChevronLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
            <button onClick={next} className={BTN_GOLD}>
              Continue
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Study time */}
      {step === 2 && (
        <div className={`${CARD} mt-8 p-6`}>
          <h1 className="text-xl font-semibold tracking-tight text-dark">
            How much time can you study?
          </h1>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {STUDY_TIME_OPTIONS.map((option) => {
              const selected = time === option;
              return (
                <button
                  key={option}
                  onClick={() => setTime(option)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2.5 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary/10 text-dark"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {time === "Custom" && (
            <div className="mt-4 grid gap-1.5">
              <label htmlFor="custom-minutes" className={LABEL}>
                Minutes per day
              </label>
              <input
                id="custom-minutes"
                type="number"
                min={5}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="e.g. 45"
                className={cn(INPUT, "max-w-40")}
              />
            </div>
          )}

          <p className={cn(LABEL, "mt-6")}>Which days can you study?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STUDY_DAYS.map((day) => {
              const selected = days.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-[13px] font-medium transition",
                    selected
                      ? "border-primary bg-primary/10 text-dark"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <p className={cn(LABEL, "mt-6")}>How would you rate your current level?</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LEVELS.map((option) => {
              const selected = level === option;
              return (
                <button
                  key={option}
                  onClick={() => setLevel(option)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                    selected
                      ? "border-primary bg-primary/10 text-dark"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex justify-between">
            <button onClick={back} className={BTN_OUTLINE}>
              <FiChevronLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
            <button onClick={next} className={BTN_GOLD}>
              Continue
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Summary */}
      {step === 3 && (
        <div className={`${CARD} mt-8 p-6`}>
          <h1 className="text-xl font-semibold tracking-tight text-dark">
            Your preparation plan
          </h1>

          <div className="mt-5 grid grid-cols-3 gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-lg font-semibold tracking-tight text-dark">{daysLabel}</p>
              <p className="text-[11px] text-slate-500">until exam</p>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-dark">{subjects.length}</p>
              <p className="text-[11px] text-slate-500">
                {subjects.length === 1 ? "subject" : "subjects"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-dark">
                {time === "Custom" ? `${customMinutes}m` : hoursPerDay}h
              </p>
              <p className="text-[11px] text-slate-500">per day</p>
            </div>
          </div>

          <p className={cn(LABEL, "mt-5")}>Recommended focus</p>
          <div className="mt-3 space-y-3">
            {RECOMMENDED_FOCUS.map((row) => (
              <div key={row.subject} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-[13px] text-slate-600">{row.subject}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right text-[13px] font-medium text-slate-600">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex justify-between">
            <button onClick={back} className={BTN_OUTLINE}>
              <FiChevronLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
            <button onClick={finish} className={BTN_GOLD}>
              Start preparation
              <FiArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

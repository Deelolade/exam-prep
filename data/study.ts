/**
 * Wizard option lists + date helpers. Exam records, practice stats and
 * insights are now read from Supabase via lib/exam-data.ts — no static exam
 * data lives here anymore.
 */

export const POPULAR_EXAMS = [
  "JAMB / UTME",
  "PostUTME",
  "WAEC",
  "NECO",
  "IELTS",
  "SAT",
  "University screening",
  "Custom exam",
];

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Engineering",
  "Biology",
  "English",
  "Current Affairs",
];

export const STUDY_TIME_OPTIONS = ["15 minutes", "30 minutes", "1 hour", "2 hours", "Custom"];

export const STUDY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const RECOMMENDED_FOCUS = [
  { subject: "Mathematics", pct: 30 },
  { subject: "Physics", pct: 25 },
  { subject: "Computer Engineering", pct: 25 },
  { subject: "English", pct: 10 },
  { subject: "Current Affairs", pct: 10 },
];

export function daysUntil(dateIso: string): number {
  const target = new Date(`${dateIso}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00`).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

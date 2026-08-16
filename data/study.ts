/**
 * Study-plan data for the authenticated app.
 *
 * NOTE: Placeholder content shown in the dashboard/pages. This module is the
 * swap point for a Supabase-backed data layer (exams, subjects, progress,
 * AI insights) — keep the exported shapes stable.
 */

export type StudySubject = {
  id: string;
  name: string;
  questions: number;
  minutes: number;
  accuracy: number; // 0-100
};

export type ActiveExam = {
  name: string;
  programme: string;
  examDate: string; // ISO date
  progress: number; // 0-100
};

export type MyExam = {
  id: string;
  name: string;
  subjects: string[];
  examDate: string;
  progress: number;
};

export type Metric = {
  label: string;
  value: string;
};

export type TrendPoint = {
  label: string;
  value: number; // 0-100
};

export type AiInsight = {
  headline: string;
  recommendation: string;
};

export const ACTIVE_EXAM: ActiveExam = {
  name: "OOU PostUTME",
  programme: "ND Computer Engineering",
  examDate: "2026-08-27",
  progress: 64,
};

export const TODAYS_PRACTICE: StudySubject[] = [
  { id: "mathematics", name: "Mathematics", questions: 15, minutes: 15, accuracy: 68 },
  { id: "physics", name: "Physics", questions: 10, minutes: 10, accuracy: 74 },
  { id: "digital-electronics", name: "Digital Electronics", questions: 15, minutes: 15, accuracy: 52 },
];

export const PRACTICE_SUBJECTS: StudySubject[] = [
  { id: "mathematics", name: "Mathematics", questions: 15, minutes: 15, accuracy: 68 },
  { id: "physics", name: "Physics", questions: 10, minutes: 10, accuracy: 74 },
  { id: "digital-electronics", name: "Digital Electronics", questions: 15, minutes: 15, accuracy: 52 },
  { id: "english", name: "English", questions: 10, minutes: 10, accuracy: 81 },
  { id: "current-affairs", name: "Current Affairs", questions: 8, minutes: 8, accuracy: 57 },
];

export const METRICS: Metric[] = [
  { label: "Questions answered", value: "124" },
  { label: "Accuracy", value: "78%" },
  { label: "Practice time", value: "4h 32m" },
];

export const TREND: TrendPoint[] = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 68 },
  { label: "Wed", value: 65 },
  { label: "Thu", value: 71 },
  { label: "Fri", value: 74 },
  { label: "Sat", value: 72 },
  { label: "Sun", value: 78 },
];

export const AI_INSIGHT: AiInsight = {
  headline:
    "You're improving in Mathematics, but probability and algebra remain your weakest areas.",
  recommendation: "Practice 15 algebra questions today before moving on.",
};

export const MY_EXAMS: MyExam[] = [
  {
    id: "1",
    name: "OOU PostUTME",
    subjects: ["ND Computer Engineering"],
    examDate: "2026-08-27",
    progress: 64,
  },
  {
    id: "2",
    name: "WAEC",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    examDate: "2027-05-01",
    progress: 31,
  },
];

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

import { createClient } from "@/lib/server";
import {
  SECTIONS as FALLBACK_SECTIONS,
  QUESTIONS as FALLBACK_QUESTIONS,
  type Question,
  type Section,
} from "@/data/questions";

// ---------- Exam content (subjects + questions) ----------

type DbQuestionRow = {
  subject_code: string;
  question: string;
  passage: string | null;
  hint: string;
  options: Question["options"];
};

type DbSubjectRow = {
  code: string;
  name: string;
  color: string;
};

/**
 * Loads exam content from Supabase (subjects + questions). Falls back to the
 * static bank in data/questions.ts if the tables are missing or empty, so the
 * app keeps working before the migrations + seed are applied.
 */
export async function getExamContent(): Promise<{
  sections: Section[];
  questions: Question[];
}> {
  const supabase = await createClient();

  const [{ data: subjects, error: subjectsError }, { data: rows, error: questionsError }] =
    await Promise.all([
      supabase.from("subjects").select("code, name, color").order("sort_order"),
      supabase
        .from("questions")
        .select("subject_code, question, passage, hint, options")
        .order("sort_order"),
    ]);

  if (
    subjectsError ||
    questionsError ||
    !subjects ||
    !rows ||
    subjects.length === 0 ||
    rows.length === 0
  ) {
    return { sections: FALLBACK_SECTIONS, questions: FALLBACK_QUESTIONS };
  }

  const questions: Question[] = (rows as DbQuestionRow[]).map((row) => ({
    section: row.subject_code,
    q: row.question,
    hint: row.hint,
    passage: row.passage ?? undefined,
    options: row.options,
  }));

  const sections: Section[] = (subjects as DbSubjectRow[]).map((subject) => ({
    code: subject.code,
    name: subject.name,
    color: subject.color,
    count: questions.filter((q) => q.section === subject.code).length,
  }));

  return { sections, questions };
}

// ---------- Student exams + practice stats ----------

export type StoredExamSubject = {
  code: string | null;
  name: string;
};

export type StoredExam = {
  id: string;
  user_id: string;
  name: string;
  institution: string | null;
  exam_date: string | null;
  daily_minutes: number | null;
  level: string | null;
  subjects: StoredExamSubject[];
  created_at: string;
};

export type SubjectStats = {
  total: number;
  answered: number;
  correct: number;
};

export type DayCount = {
  label: string;
  value: number;
};

export type ExamStats = {
  questionsBySubject: Record<string, SubjectStats>;
  totalAnswered: number;
  overallCorrect: number;
  answersByDay: DayCount[];
};

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** The user's exams, most recently created first. */
export async function getUserExams(): Promise<StoredExam[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as StoredExam[];
}

/** One exam by id — RLS restricts this to the signed-in user's own exams. */
export async function getExamById(id: string): Promise<StoredExam | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as StoredExam;
}

/**
 * Practice stats aggregated from the questions + practice_answers tables.
 * Safe to call when the tables are empty or missing.
 */
export async function getExamStats(): Promise<ExamStats> {
  const supabase = await createClient();

  const [{ data: questions }, { data: answers }] = await Promise.all([
    supabase.from("questions").select("id, subject_code"),
    supabase.from("practice_answers").select("question_id, is_correct, answered_at"),
  ]);

  const questionSubject = new Map<string, string>();
  const questionsBySubject: Record<string, SubjectStats> = {};

  for (const q of questions ?? []) {
    questionSubject.set(q.id, q.subject_code);
    const stats = (questionsBySubject[q.subject_code] ??= { total: 0, answered: 0, correct: 0 });
    stats.total += 1;
  }

  let totalAnswered = 0;
  let overallCorrect = 0;
  const byDay = new Map<string, number>();

  for (const answer of answers ?? []) {
    const code = questionSubject.get(answer.question_id);
    if (!code) continue;
    const stats = questionsBySubject[code];
    if (!stats) continue;

    stats.answered += 1;
    totalAnswered += 1;
    if (answer.is_correct) {
      stats.correct += 1;
      overallCorrect += 1;
    }

    if (answer.answered_at) {
      const key = dayKey(new Date(answer.answered_at));
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
  }

  // Last 7 days (including today), zero-filled.
  const answersByDay: DayCount[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = dayKey(date);
    answersByDay.push({
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      value: byDay.get(key) ?? 0,
    });
  }

  return { questionsBySubject, totalAnswered, overallCorrect, answersByDay };
}

/** Progress (0-100) for one exam based on answered vs total questions in its subjects. */
export function examProgress(exam: StoredExam, stats: ExamStats): number {
  const codes = new Set(exam.subjects.map((s) => s.code).filter((c): c is string => c !== null));
  let total = 0;
  let answered = 0;
  for (const code of codes) {
    const subject = stats.questionsBySubject[code];
    if (subject) {
      total += subject.total;
      answered += subject.answered;
    }
  }
  return total > 0 ? Math.round((answered / total) * 100) : 0;
}

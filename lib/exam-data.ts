import { createClient } from "@/lib/server";
import { createAdminClient } from "@/lib/server-admin";
import { generateQuestions } from "@/lib/ai/generate-questions";
import { getAiModel } from "@/utils/env";
import type { Question, Section } from "@/data/questions";

/** Fresh AI questions generated per subject when an exam's set is prepared. */
export const QUESTIONS_PER_SUBJECT = 10;

// ---------- Exam content (subjects + questions) ----------

type DbQuestionRow = {
  subject_code: string;
  question: string;
  passage: string | null;
  hint: string;
  options: Question["options"];
};

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

/** All subjects, for building the section legend of an exam's practice set. */
export async function getSubjectSections(): Promise<Section[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subjects")
    .select("code, name, color")
    .order("sort_order");

  if (error || !data) return [];
  return data.map((s) => ({ code: s.code, name: s.name, color: s.color, count: 0 }));
}



/**
 * The exam's own practice questions (exam-scoped), or null when none exist
 * yet. Deduplicates by question text (earliest row wins) so a second
 * generation run — or a model that repeats itself — can't surface doubles.
 */
export async function getExamQuestions(exam: StoredExam): Promise<Question[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("subject_code, question, passage, hint, options")
    .eq("exam_id", exam.id)
    .order("sort_order")
    .order("created_at")
    .order("id");

  if (error || !data || data.length === 0) return null;

  const seen = new Set<string>();
  const questions: Question[] = [];
  for (const row of data as DbQuestionRow[]) {
    if (seen.has(row.question)) continue;
    seen.add(row.question);
    questions.push({
      section: row.subject_code,
      q: row.question,
      hint: row.hint,
      passage: row.passage ?? undefined,
      options: row.options,
    });
  }

  return questions.length > 0 ? questions : null;
}

/** Generates one subject's set with retries + backoff (rate-limit friendly). */
async function generateSubjectQuestions(
  subject: StoredExamSubject,
  nameByCode: Map<string, string>,
  examName: string,
): Promise<Question[]> {
  const code = subject.code as string;
  const input = {
    subjectCode: code,
    subjectName: nameByCode.get(code) ?? subject.name,
    count: QUESTIONS_PER_SUBJECT,
    examType: examName,
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await generateQuestions(input);
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        const delay = 2000 * (attempt + 1);
        console.error(
          `Question generation failed for ${subject.name}; retrying in ${delay}ms:`,
          error,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Generates sets for the given subjects with limited concurrency, spacing
 * batches apart so parallel calls don't trip provider rate limits.
 */
async function generateForSubjects(
  subjects: StoredExamSubject[],
  nameByCode: Map<string, string>,
  examName: string,
): Promise<Question[]> {
  const CONCURRENCY = 2;
  const generated: Question[] = [];

  for (let i = 0; i < subjects.length; i += CONCURRENCY) {
    const batch = subjects.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((subject) => generateSubjectQuestions(subject, nameByCode, examName)),
    );

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        generated.push(...result.value);
      } else {
        console.error(`Failed to generate questions for ${batch[idx].name}:`, result.reason);
      }
    });

    if (i + CONCURRENCY < subjects.length) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return generated;
}

/**
 * Returns the exam's questions, generating a fresh AI set per missing subject
 * (scaled by the number of selected subjects) and persisting it to Supabase.
 * Subjects that already have questions are never regenerated. Returns null if
 * the exam has no subjects with a question bank.
 */
export async function ensureExamQuestions(exam: StoredExam): Promise<Question[] | null> {
  const coded = exam.subjects.filter((s) => s.code !== null && s.code !== undefined);
  if (coded.length === 0) return null;

  const admin = createAdminClient();

  const { data: subjectRows } = await admin
    .from("subjects")
    .select("code, name")
    .in(
      "code",
      coded.map((s) => s.code as string),
    );
  const nameByCode = new Map((subjectRows ?? []).map((s) => [s.code, s.name]));

  // Only generate for subjects that still need questions.
  const existing = (await getExamQuestions(exam)) ?? [];
  const covered = new Set(existing.map((q) => q.section));
  const missing = coded.filter((s) => !covered.has(s.code as string));

  if (missing.length === 0) return existing;

  const generated = await generateForSubjects(missing, nameByCode, exam.name);

  let order = existing.length;
  const rows = generated.map((q) => ({
    subject_code: q.section,
    question: q.q,
    passage: q.passage ?? null,
    hint: q.hint,
    options: q.options,
    source: "ai",
    model: getAiModel(),
    sort_order: order++,
    exam_id: exam.id,
  }));

  if (rows.length > 0) {
    // Conflict-safe: if another run already inserted these (or the model
    // repeated itself within this batch), duplicates are ignored.
    const { error } = await admin.from("questions").upsert(rows, {
      onConflict: "exam_id,question",
      ignoreDuplicates: true,
    });
    if (error) {
      console.error("Failed to persist exam questions:", error);
      throw error;
    }
  }

  // Re-read so the returned set matches what's actually in the DB (in case a
  // concurrent run won the race).
  return (await getExamQuestions(exam)) ?? existing;
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

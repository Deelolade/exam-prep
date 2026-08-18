import { createClient } from "@/lib/server";
import {
  SECTIONS as FALLBACK_SECTIONS,
  QUESTIONS as FALLBACK_QUESTIONS,
  type Question,
  type Section,
} from "@/data/questions";

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

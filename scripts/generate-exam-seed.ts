/**
 * Generates supabase/migrations/0003_seed_exam_data.sql from data/questions.ts.
 *
 * Run: node --experimental-strip-types scripts/generate-exam-seed.ts
 */
import { writeFileSync } from "node:fs";
import { SECTIONS, QUESTIONS } from "../data/questions.ts";

const esc = (s: string) => s.replace(/'/g, "''");

const lines: string[] = [];
lines.push("-- Bootstrap exam content: subjects + the original question bank.");
lines.push("-- Run after 0002_exam_schema.sql. These rows default to source='seed'.");
lines.push("");
lines.push("insert into public.subjects (code, name, color, sort_order) values");
SECTIONS.forEach((s, i) => {
  const comma = i < SECTIONS.length - 1 ? "," : ";";
  lines.push(`  ('${esc(s.code)}', '${esc(s.name)}', '${esc(s.color)}', ${i})${comma}`);
});
lines.push("");
lines.push(
  "insert into public.questions (subject_code, question, passage, hint, options, sort_order) values",
);
QUESTIONS.forEach((q, i) => {
  const passage = q.passage ? `'${esc(q.passage)}'` : "null";
  const comma = i < QUESTIONS.length - 1 ? "," : ";";
  lines.push(
    `  ('${esc(q.section)}', '${esc(q.q)}', ${passage}, '${esc(q.hint)}', '${esc(JSON.stringify(q.options))}'::jsonb, ${i})${comma}`,
  );
});

writeFileSync("supabase/migrations/0003_seed_exam_data.sql", lines.join("\n") + "\n");
console.log(
  `Wrote supabase/migrations/0003_seed_exam_data.sql (${SECTIONS.length} subjects, ${QUESTIONS.length} questions)`,
);

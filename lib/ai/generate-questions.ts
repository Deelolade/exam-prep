import type { Question } from "@/data/questions";
import { getOpenAIKey, getAiBaseUrl, getAiModel } from "@/utils/env";

export type GenerateQuestionsInput = {
  subjectCode: string;
  subjectName: string;
  count: number;
  difficulty?: "easy" | "medium" | "hard";
  examType?: string;
};

type RawOption = { t?: unknown; c?: unknown; r?: unknown };
type RawQuestion = {
  q?: unknown;
  hint?: unknown;
  passage?: unknown;
  options?: RawOption[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates one AI-generated question. Returns the Question fields (without
 * `section`, which is derived from the subject) or null if malformed.
 */
export function validateQuestion(raw: RawQuestion): Omit<Question, "section"> | null {
  if (!raw || !isNonEmptyString(raw.q) || !isNonEmptyString(raw.hint)) return null;

  if (!Array.isArray(raw.options) || raw.options.length !== 4) return null;

  const options = raw.options.map((o) => ({
    t: isNonEmptyString(o?.t) ? o.t.trim() : "",
    c: o?.c === true,
    r: isNonEmptyString(o?.r) ? o.r.trim() : "",
  }));

  if (options.some((o) => !o.t || !o.r)) return null;
  if (options.filter((o) => o.c).length !== 1) return null;

  return {
    q: raw.q.trim(),
    hint: raw.hint.trim(),
    passage: isNonEmptyString(raw.passage) ? raw.passage.trim() : undefined,
    options,
  };
}

/**
 * Generates CBT questions via an OpenAI-compatible chat completions API.
 * Configure with OPENAI_API_KEY; optionally override the endpoint/model with
 * AI_BASE_URL and AI_MODEL (works with OpenAI, DeepSeek, Groq, OpenRouter,
 * local proxies, etc.).
 */
export async function generateQuestions(
  input: GenerateQuestionsInput,
): Promise<Question[]> {
  const apiKey = getOpenAIKey();
  const baseUrl = getAiBaseUrl();
  const model = getAiModel();

  const system = [
    "You write CBT (computer-based test) practice questions for Nigerian exams.",
    `Exam type: ${input.examType ?? "general"}. Subject: ${input.subjectName}.`,
    'Respond with ONLY a JSON object: {"questions": [ ... ]}.',
    "Each question object has exactly these fields:",
    '- "q": the question text',
    '- "hint": a short hint',
    '- "passage": an optional reading passage (omit for most questions)',
    '- "options": exactly 4 objects, each with "t" (option text), "c" (boolean — true only for the single correct option) and "r" (one-sentence explanation)',
    "Exactly one option per question must have c: true.",
    `Generate ${input.count} questions${input.difficulty ? ` with ${input.difficulty} difficulty` : ""}.`,
  ].join("\n");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: "Generate the questions now." },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`AI request failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  const data: unknown = await response.json();
  const content = (data as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]
    ?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI response did not include content");
  }

  let parsed: { questions?: RawQuestion[] };
  try {
    parsed = JSON.parse(content) as { questions?: RawQuestion[] };
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  if (!Array.isArray(parsed.questions)) {
    throw new Error("AI response is missing the questions array");
  }

  const questions = parsed.questions
    .map((raw) => {
      const valid = validateQuestion(raw);
      return valid ? { ...valid, section: input.subjectCode } : null;
    })
    .filter((q): q is Question => q !== null);

  if (questions.length === 0) {
    throw new Error("AI returned no valid questions");
  }

  return questions;
}

import type { Question } from "@/data/questions";
import { getAIAPIKey, getAiBaseUrl, getAiModel } from "@/utils/env";

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
export function validateQuestion(
  raw: RawQuestion,
): Omit<Question, "section"> | null {
  if (!raw || !isNonEmptyString(raw.q) || !isNonEmptyString(raw.hint))
    return null;

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
 * Configure with AI_API_KEY; optionally override the endpoint/model with
 * AI_BASE_URL and AI_MODEL (works with OpenAI, DeepSeek, Groq, OpenRouter,
 * local proxies, etc.).
 */
export async function generateQuestions(
  input: GenerateQuestionsInput,
): Promise<Question[]> {
  const apiKey = getAIAPIKey();
  const baseUrl = getAiBaseUrl();
  const model = getAiModel();

  const system = `
  You are an expert CBT examination question writer specializing in
  Nigerian secondary-school, university screening, PostUTME, JAMB,
  WAEC, NECO, and ND-level examinations.

  Your task is to generate high-quality multiple-choice questions
  for the specified exam, subject, topic, and difficulty.

  EXAM:
  ${input.examType ?? "General Nigerian examination"}

  SUBJECT:
  ${input.subjectName}

  DIFFICULTY:
  ${input.difficulty ?? "mixed"}

  STRICT REQUIREMENTS:

  1. Generate exactly ${input.count} questions.

  2. Every question must test a meaningful concept from the specified
     subject. Do not create vague, trivial, or filler questions.

  3. Each question must have exactly 4 answer options.

  4. Exactly ONE option must be correct.

  5. The three incorrect options must be plausible distractors.
     Do not use obviously ridiculous answers.

  6. Do not reveal the correct answer in the question text or hint.

  7. Every question must have a useful hint that helps the student
     think about the problem without directly revealing the answer.

  8. Every option must contain a short explanation explaining why
     that option is correct or incorrect.

  9. For numerical questions, ensure all calculations are correct.

  10. Avoid duplicate questions.

  11. Vary the wording, scenarios, and concepts across questions.

  12. Match the difficulty to the requested level.

  13. For Nigerian examinations, use terminology and context familiar
      to Nigerian students where appropriate.

  14. If a passage is unnecessary, omit it.

  OUTPUT FORMAT:

  Return ONLY valid JSON.

  {
    "questions": [
      {
        "q": "Question text",
        "hint": "Helpful hint",
        "passage": "Optional passage",
        "options": [
          {
            "t": "Option text",
            "c": true,
            "r": "Explanation"
          },
          {
            "t": "Option text",
            "c": false,
            "r": "Explanation"
          },
          {
            "t": "Option text",
            "c": false,
            "r": "Explanation"
          },
          {
            "t": "Option text",
            "c": false,
            "r": "Explanation"
          }
        ]
      }
    ]
  }

  Do not include markdown.
  Do not include commentary.
  Do not include an answer key outside the questions.
  `;

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
    throw new Error(
      `AI request failed (${response.status}): ${detail.slice(0, 200)}`,
    );
  }

  const data: unknown = await response.json();
  const content = (data as { choices?: { message?: { content?: unknown } }[] })
    ?.choices?.[0]?.message?.content;

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

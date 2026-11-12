import type { Question } from "@/data/questions";
import { getAIAPIKey, getAiBaseUrl, getAiModel } from "@/utils/env";

export type GenerateQuestionsInput = {
  subjectCode: string;
  subjectName: string;
  count: number;
  difficulty?: "easy" | "medium" | "hard";
  level?: string;
  examType?: string;
  institution?: string;
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
 * Extracts a JSON object from a model response. Tolerates markdown code
 * fences and surrounding commentary by slicing between the first `{` and the
 * last `}`.
 */
function extractJson(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1].trim() : trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return candidate.slice(start, end + 1);
  }
  return candidate;
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

function getDifficultySpecification(input: GenerateQuestionsInput): string {
  const levelNormalized = (input.level ?? "").toLowerCase().trim();
  const diffNormalized = (input.difficulty ?? "").toLowerCase().trim();

  const isHard =
    diffNormalized === "hard" ||
    levelNormalized === "advanced" ||
    levelNormalized === "expert";

  const isEasy =
    diffNormalized === "easy" ||
    levelNormalized === "beginner";

  if (isHard) {
    return `HIGH-DIFFICULTY / TOP-PERCENTILE CUTOFF STANDARD (HARD / ADVANCED)
- Rigor Level: The most demanding tier of official past examination papers (the top 10-15% discriminator questions).
- Cognitive Depth: Complex multi-step reasoning, non-trivial synthesis across syllabus topics, subtle edge cases, deceptive distractors with common calculation pitfalls or near-miss lexical choices.
- Texts/Passages: Dense, sophisticated, academic or literary prose requiring deep inferential analysis, rhetorical evaluation, and tone/attitude discernment.`;
  }

  if (isEasy) {
    return `FOUNDATIONAL / BASELINE REAL-EXAM STANDARD (EASY / BEGINNER)
- Rigor Level: Foundational baseline strictly adhering to the official examination syllabus.
- IMPORTANT: This does NOT mean primary, elementary, or middle-school questions! It must be at the genuine entry-level standard for candidates sitting THIS specific exam (core definitions, fundamental principles, direct application of standard formulas).
- Texts/Passages: Clear, authentic exam-level texts without contrived or overly labyrinthine phrasing, yet still mature and comprehensive.`;
  }

  return `AUTHENTIC REAL-EXAM TEST-DAY STANDARD (STANDARD / INTERMEDIATE)
- Rigor Level: The EXACT standard, cognitive load, and difficulty encountered by candidates on official exam day.
- Cognitive Depth: Reflects the core 50th-75th percentile questions from authentic official past papers. Multi-step problem solving, realistic exam-day calculations, authentic distractors, and rigorous syllabus depth.
- Texts/Passages: Full-length, authentic exam reading passages with rich vocabulary, structured paragraphs, and nuanced comprehension questions testing both stated details and deductive inference.`;
}

function getExamSpecification(examType?: string, institution?: string): string {
  const exam = (examType ?? "").toLowerCase();

  let institutionNote = "";
  if (institution && institution.trim()) {
    institutionNote = `\n  - Target Institution: ${institution.trim()}. Where applicable (such as post-screening, institutional current affairs, or university-specific question formats), align with ${institution.trim()}'s testing style and past questions pattern.`;
  }

  if (exam.includes("jamb") || exam.includes("utme")) {
    return `EXAMINATION BENCHMARK: JAMB / UTME (Joint Admissions and Matriculation Board)
  - Syllabus: Official JAMB UTME Syllabus for Nigerian tertiary admissions.
  - English Language: Authentic comprehension passages (180–350 words) with academic/literary tone, rich vocabulary, contextual inference, author tone/mood/attitude, lexis & structure, idioms, antonyms/synonyms with nuanced distinctions, and sentence interpretation. Never childish or 1-sentence snippets.
  - Mathematics: UTME standard topics (surds, indices, logarithms, quadratic & polynomial functions, AP/GP, matrices, coordinate geometry, trigonometry, differentiation, integration, permutations/combinations, probability, statistics). Calculations must require standard multi-step working.
  - Sciences (Physics, Chemistry, Biology): Authentic JAMB syllabus depth. Multi-step numerical questions, stoichiometry, kinematics, equilibrium, genetics crosses, photosynthesis, thermodynamics, electromagnetism. Realistic formulas and deceptive distractor options that match typical student calculation mistakes.${institutionNote}`;
  }

  if (exam.includes("postutme") || exam.includes("post-utme") || exam.includes("screening")) {
    return `EXAMINATION BENCHMARK: University Post-UTME / Tertiary Screening
  - Standard: Highly competitive university admission screening designed to filter candidates for prestigious university faculties.
  - Rigor: Equal to or more rigorous than JAMB UTME. Fast-paced, testing higher-order critical thinking, combined concepts, multi-step problem solving, advanced vocabulary, and institutional background where relevant.${institutionNote}`;
  }

  if (exam.includes("waec") || exam.includes("wassce") || exam.includes("neco") || exam.includes("ssce")) {
    return `EXAMINATION BENCHMARK: WAEC (WASSCE) / NECO (SSCE)
  - Syllabus: West African Senior School Certificate Examination / National Examinations Council syllabus (SS1-SS3).
  - Rigor: Comprehensive syllabus coverage, testing core theoretical foundations, standard diagrams/mechanisms, practical science applications, and formal comprehension texts with vocabulary-in-context and literary appreciation.${institutionNote}`;
  }

  if (exam.includes("sat")) {
    return `EXAMINATION BENCHMARK: College Board Digital SAT
  - Reading & Writing: Analytical excerpts (literature, history/social studies, science) testing Craft and Structure, Information and Ideas, Standard English Conventions, and Expression of Ideas. Academic rhetoric and vocabulary in context.
  - Math: Advanced algebra, problem solving and data analysis, functions, geometry and trigonometry. Multi-step contextual word problems matching College Board standards.${institutionNote}`;
  }

  if (exam.includes("ielts")) {
    return `EXAMINATION BENCHMARK: IELTS (International English Language Testing System)
  - Standard: CEFR B2 - C1 academic reading texts. Multi-paragraph texts testing detailed comprehension, identifying writer's views/claims, matching information, and lexical deduction in authentic academic/workplace English.${institutionNote}`;
  }

  return `EXAMINATION BENCHMARK: ${examType ?? "Official Competitive Examination"}
  - Standard: Higher education entrance or certification examination standard.
  - Rigor: Adhere strictly to the professional or matriculation syllabus for this subject. All texts and questions must exhibit authentic academic maturity, analytical problem-solving, and non-trivial distractors.${institutionNote}`;
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
You are an expert examination body question writer and psychometrician specializing in authentic, standardized CBT examination question generation.

CRITICAL MISSION:
You must generate multiple-choice questions that EXACTLY MATCH THE REAL-WORLD DIFFICULTY, COGNITIVE RIGOR, AND TEXT COMPLEXITY of the specified examination.
DO NOT DUMB DOWN QUESTIONS. Under no circumstances should questions or reading passages be simplistic, childish, or trivial. Candidates rely on these tests to accurately reflect real exam conditions.

==================================================
EXAMINATION PROFILE:
==================================================
Exam: ${input.examType ?? "Standardized CBT Examination"}
Subject: ${input.subjectName}
${getExamSpecification(input.examType, input.institution)}

==================================================
TARGET DIFFICULTY LEVEL:
==================================================
${getDifficultySpecification(input)}

==================================================
STRICT REQUIREMENTS:
==================================================

1. EXACT QUANTITY:
   Generate exactly ${input.count} questions.

2. TEXT & PASSAGE STANDARDS (CRITICAL):
   - For English, Language, Comprehension, Literature, or any question utilizing reading texts:
     * The passage ("passage" field) MUST be an authentic, full-length, coherent reading passage (typically 180 to 350 words for comprehension), NOT a short 1-2 sentence snippet!
     * The passage must feature mature vocabulary, formal academic syntax, structured paragraph flow, and intellectually engaging topics (e.g. science, environmental issues, socio-economic debates, African or world history, philosophy, or literature).
     * Questions based on the passage must test higher-order cognitive comprehension: deducing implied meanings, identifying the author's tone/attitude/perspective, determining word or idiomatic meanings in context, analyzing rhetorical techniques, and evaluating arguments.
     * NEVER create trivial questions that can be solved by simple word-matching without understanding the text.
   - For non-comprehension questions or subjects where a passage is not customary (e.g. purely computational math problems), omit the "passage" field.

3. STEM & CALCULATION RIGOR:
   - For Mathematics, Physics, Chemistry, and Engineering:
     * All numerical values, scientific laws, and calculations must be 100% mathematically and scientifically accurate.
     * Questions must require genuine multi-step problem solving (e.g., formula identification, unit conversion, algebraic substitution and solving) consistent with the real exam syllabus.
     * Calculations must be realistic for CBT exams (solvable within standard exam time limits with scratch paper).

4. AUTHENTIC DISTRACTORS & OPTIONS:
   - Exactly 4 answer options (A, B, C, D) per question.
   - Exactly ONE option must be correct ("c": true).
   - The three incorrect options must be plausible, authentic distractors. In real exams, wrong options are based on common student traps (e.g. sign error, inverse formula, partial calculation step, false friend word, misreading the prompt). NEVER provide obviously silly or filler options.

5. EDUCATIVE HINTS & EXPLANATIONS:
   - Every question must include a hint ("hint") that gives a helpful cognitive nudge or principle to consider (e.g., "Consider what happens to the velocity when kinetic energy equals potential energy") WITHOUT giving away the answer.
   - Every single option must include a concise, clear rationale ("r"):
     * For the correct option: explain why it is scientifically, grammatically, or logically sound.
     * For incorrect options: explain the exact error, fallacy, or trap that makes it wrong.

6. AVOID TRIVIAL RECALL:
   - Do not ask superficial trivialities. Test application, comprehension, analysis, and problem-solving.

7. OUTPUT FORMAT:
   Return ONLY a valid JSON object matching this exact schema:
   {
     "questions": [
       {
         "q": "The question text",
         "hint": "Guiding hint",
         "passage": "Full passage text when applicable, or omit if not needed",
         "options": [
           { "t": "Option A text", "c": true, "r": "Why A is correct" },
           { "t": "Option B text", "c": false, "r": "Why B is incorrect" },
           { "t": "Option C text", "c": false, "r": "Why C is incorrect" },
           { "t": "Option D text", "c": false, "r": "Why D is incorrect" }
         ]
       }
     ]
   }
`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 4000,
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
      `AI request failed (${response.status}) for ${baseUrl}: ${detail.slice(0, 300)}`,
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
    parsed = JSON.parse(extractJson(content)) as { questions?: RawQuestion[] };
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

"use client";

import { useState } from "react";
import { FiCheck, FiX, FiList, FiRotateCcw, FiAlertCircle } from "react-icons/fi";
import type { Question, Section } from "@/data/questions";

type ResultsProps = {
  sections: Section[];
  questions: Question[];
  answers: (number | null)[];
  onRetake: () => void;
};

export default function Results({ sections, questions, answers, onRetake }: ResultsProps) {
  const [showReview, setShowReview] = useState(false);

  const total = questions.length;
  const correct = answers.reduce<number>(
    (acc, a, i) => acc + (a !== null && questions[i].options[a].c ? 1 : 0),
    0,
  );
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="min-h-screen py-10 px-5">
      <div className="max-w-205 mx-auto">
        <div className="bg-dark border border-slate-700 rounded-2xl px-7 py-8 text-center mb-6 shadow-lg">
          <div className="font-display text-[56px] font-bold text-white leading-none mb-1.5">
            {correct}/{total}
          </div>
          <div className="text-slate-300 text-sm">{pct}% overall</div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 mb-7">
          {sections.map((s) => {
            const indexes = questions.map((q, i) => ({ q, i }))
              .filter((o) => o.q.section === s.code)
              .map((o) => o.i);
            const sectionCorrect = indexes.reduce(
              (acc, i) => acc + (answers[i] !== null && questions[i].options[answers[i]].c ? 1 : 0),
              0,
            );

            return (
              <div key={s.code} className="bg-white border border-slate-200 rounded-[10px] px-4 py-3.5">
                <div className="text-[11.5px] uppercase tracking-[0.06em] font-mono" style={{ color: s.color }}>
                  {s.name}
                </div>
                <div className="font-display text-[22px] font-bold text-dark mt-1">
                  {sectionCorrect}/{indexes.length}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center mb-9 flex-wrap">
          <button
            onClick={() => setShowReview((v) => !v)}
            className="inline-flex items-center gap-2 bg-transparent border-[1.5px] border-slate-300 text-dark px-5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            <FiList className="w-4 h-4" aria-hidden="true" />
            {showReview ? "Hide full review" : "Show full review"}
          </button>
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 bg-transparent border-[1.5px] border-slate-300 text-dark px-5 py-2.5 rounded-lg cursor-pointer text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            <FiRotateCcw className="w-4 h-4" aria-hidden="true" />
            Retake exam
          </button>
        </div>

        {showReview && (
          <>
            <p className="font-mono text-xs tracking-[0.12em] uppercase text-slate-500 mb-3.5">Full review</p>
            <div className="flex flex-col gap-3">
              {questions.map((q, i) => {
                const a = answers[i];

                return (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-5">
                    <div className="font-display font-bold text-[16px] text-dark mb-2">
                      Q{i + 1}. {q.q}
                    </div>

                    {a === null ? (
                      <div className="text-[13.5px] text-slate-500 italic flex items-start gap-2">
                        <FiAlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        Skipped — correct answer: {q.options.find((o) => o.c)?.t}
                      </div>
                    ) : q.options[a].c ? (
                      <div className="text-[13.5px] text-success font-medium flex items-start gap-2">
                        <FiCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        Correct — {q.options[a].t}
                      </div>
                    ) : (
                      <div className="text-[13.5px] text-error flex items-start gap-2">
                        <FiX className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        Your answer: {q.options[a].t} — Correct: {q.options.find((o) => o.c)?.t}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

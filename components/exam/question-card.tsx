"use client";

import { useState } from "react";
import { TbBulb } from "react-icons/tb";
import { SECTIONS, type Question } from "@/data/questions";

type QuestionCardProps = {
  question: Question;
  index: number;
  total: number;
  picked: number | null;
  onPick: (optionIndex: number) => void;
};

export default function QuestionCard({ question, index, total, picked, onPick }: QuestionCardProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const section = SECTIONS.find((s) => s.code === question.section);
  const locked = picked !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.25)] px-6 py-7 sm:px-9 sm:py-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="font-mono bg-dark text-white text-[13px] px-2.5 py-1 rounded-md font-semibold">
          Q{index + 1} / {total}
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase" style={{ color: section?.color }}>
          Section {section?.code} · {section?.name}
        </span>
      </div>

      {question.passage && (
        <div
          className="text-[14.5px] leading-relaxed italic text-slate-500 bg-slate-50 border-l-4 rounded-r-md px-4 py-3 mb-5 -mt-2"
          style={{ borderColor: section?.color }}
        >
          {question.passage}
        </div>
      )}

      <p className="font-display text-[21px] leading-normal font-semibold text-dark mb-6">{question.q}</p>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);

          let stateClass = "";
          if (locked) {
            if (idx === picked && opt.c) stateClass = "bg-success/10 border-success";
            else if (idx === picked && !opt.c) stateClass = "bg-error/10 border-error";
            else if (opt.c) stateClass = "bg-success/10 border-success opacity-90";
            else stateClass = "opacity-55";
          }

          const letterClass = locked && (opt.c || idx === picked) ? (opt.c ? "bg-success text-white" : "bg-error text-white") : "bg-dark text-white";
          const showReason = locked;

          return (
            <button
              key={idx}
              disabled={locked}
              onClick={() => onPick(idx)}
              className={`flex gap-3.5 items-start text-left bg-white border-[1.5px] border-slate-200 rounded-[10px] px-4 py-3.5 cursor-pointer transition hover:border-slate-500 disabled:cursor-default ${stateClass}`}
            >
              <span className={`font-mono font-bold text-[13px] w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${letterClass}`}>
                {letter}
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[15.5px] leading-normal ${locked && (opt.c || idx === picked) ? "font-semibold" : ""}`}>
                  {opt.t}
                </span>
                <span className={`text-[13px] text-slate-500 mt-1.5 leading-[1.55] ${showReason ? "block" : "hidden"}`}>
                  {opt.r}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2.5 flex-wrap">
        <button
          onClick={() => setHintOpen((open) => !open)}
          aria-expanded={hintOpen}
          className="inline-flex items-center gap-2 bg-transparent border-[1.5px] border-dashed border-warning/70 text-warning px-3.5 py-2 rounded-full text-[12.5px] font-medium cursor-pointer font-mono hover:border-warning hover:text-amber-600 transition"
        >
          <TbBulb className="w-3.5 h-3.5" aria-hidden="true" />
          {hintOpen ? "Hide hint" : "Show hint"}
        </button>
        {hintOpen && <span className="text-[13.5px] text-slate-500 italic">{question.hint}</span>}
      </div>
    </div>
  );
}

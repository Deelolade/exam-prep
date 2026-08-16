import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { SECTIONS, QUESTIONS } from "@/data/questions";

type LandingProps = {
  onStart: () => void;
};

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8 relative">
      <Link
        href="/auth/login"
        className="absolute top-5 right-5 inline-flex items-center gap-2 border border-slate-300 bg-white text-dark px-4 py-2 rounded-lg text-[13px] font-semibold hover:border-primary hover:text-primary transition"
      >
        Sign in
      </Link>
      <div className="max-w-190 w-full">
        <p className="font-mono text-xs tracking-[0.14em] uppercase text-primary mb-3.5">
          CBT Screening Exam · Simulator
        </p>

        <h1 className="font-display font-bold text-[clamp(32px,5vw,50px)] leading-[1.05] text-dark mb-3">
          50-question mock screening exam
        </h1>

        <p className="text-slate-500 text-base leading-relaxed max-w-[56ch] mb-8">
          Timed, section-balanced practice modelled on the OOU ND Computer Engineering CBT screening — pure sciences,
          mathematics, language, institutional knowledge, current affairs and technical background. Every option comes
          with a reason, and every question has a hint.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-2.5 mb-8">
          {SECTIONS.map((s) => (
            <div
              key={s.code}
              className="bg-white border border-slate-200 rounded-[10px] px-4 py-3.5 flex items-center gap-3"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span className="text-[13px] text-slate-500 leading-tight">
                <b className="block text-[13.5px] font-semibold text-dark">{s.name}</b>
                Section {s.code}
              </span>
              <span className="ml-auto font-mono text-xs text-primary">{s.count}Q</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg text-[15px] font-bold tracking-wide cursor-pointer transition duration-150 hover:bg-primary-hover hover:-translate-y-px active:translate-y-0 shadow-sm shadow-primary/30"
          >
            Start exam
            <FiArrowRight className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-slate-400">
            {QUESTIONS.length} questions · no time limit · answers explained instantly
          </span>
        </div>
      </div>
    </div>
  );
}

import {
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiCheckCircle,
  FiTarget,
  FiFlag,
} from "react-icons/fi";
import { SECTIONS, QUESTIONS } from "@/data/questions";
import SegmentedBar from "./segmented-bar";
import Navigator from "./navigator";
import QuestionCard from "./question-card";

type ExamViewProps = {
  current: number;
  answers: (number | null)[];
  flags: boolean[];
  onPick: (optionIndex: number) => void;
  onJump: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onToggleFlag: (index: number) => void;
};

export default function ExamView({
  current,
  answers,
  flags,
  onPick,
  onJump,
  onPrev,
  onNext,
  onSubmit,
  onToggleFlag,
}: ExamViewProps) {
  const question = QUESTIONS[current];
  const total = QUESTIONS.length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = answers.reduce<number>(
    (acc, a, i) => acc + (a !== null && QUESTIONS[i].options[a].c ? 1 : 0),
    0,
  );
  const isFlagged = flags[current];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-295 mx-auto px-5 pt-3.5 pb-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-primary text-xs tracking-widest">CBT-SIM</span>
            <h2 className="font-display text-lg font-bold text-dark">Screening Exam</h2>
          </div>

          <div className="font-mono text-[12.5px] text-slate-500 flex gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <FiFileText className="w-3.5 h-3.5" aria-hidden="true" />
              Question <b className="text-dark">{current + 1}</b>/{total}
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Answered <b className="text-dark">{answeredCount}</b>
            </span>
            <span className="flex items-center gap-1.5">
              <FiTarget className="w-3.5 h-3.5" aria-hidden="true" />
              Score so far <b className="text-dark">{score}</b>
            </span>
          </div>
        </div>
        <SegmentedBar sections={SECTIONS} questions={QUESTIONS} answers={answers} />
      </header>

      <main className="flex-1 max-w-295 w-full mx-auto flex flex-col lg:flex-row gap-5 px-5 pt-5 pb-10 items-start">
        <Navigator count={total} current={current} answers={answers} flags={flags} onJump={onJump} />

        <div className="flex-1 min-w-0 w-full">
          <QuestionCard
            question={question}
            index={current}
            total={total}
            picked={answers[current]}
            onPick={onPick}
          />

          <div className="flex justify-between items-center mt-6 gap-3 flex-wrap">
            <div className="flex gap-2.5">
              <button
                onClick={onPrev}
                disabled={current === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-slate-300 bg-white text-dark hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={current === total - 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-slate-300 bg-white text-dark hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
              >
                Next
                <FiChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => onToggleFlag(current)}
                aria-pressed={isFlagged}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border transition ${
                  isFlagged
                    ? "border-warning bg-warning/10 text-warning"
                    : "border-slate-300 bg-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <FiFlag className="w-4 h-4" aria-hidden="true" />
                {isFlagged ? "Flagged" : "Flag"}
              </button>
              <button
                onClick={onSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover transition shadow-sm shadow-primary/30"
              >
                Submit exam
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

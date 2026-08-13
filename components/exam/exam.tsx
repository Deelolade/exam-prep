"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { QUESTIONS } from "@/data/questions";
import Landing from "./landing";
import ExamView from "./exam-view";
import Results from "./results";

type View = "landing" | "exam" | "results";

const EMPTY_ANSWERS = (): (number | null)[] => new Array(QUESTIONS.length).fill(null);
const EMPTY_FLAGS = (): boolean[] => new Array(QUESTIONS.length).fill(false);

export default function Exam() {
  const [view, setView] = useState<View>("landing");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(EMPTY_ANSWERS);
  const [flags, setFlags] = useState<boolean[]>(EMPTY_FLAGS);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, current]);

  const reset = useCallback(() => {
    setAnswers(EMPTY_ANSWERS());
    setFlags(EMPTY_FLAGS());
    setCurrent(0);
  }, []);

  const startExam = () => {
    reset();
    setView("exam");
  };

  const retakeExam = () => {
    reset();
    setView("landing");
  };

  const finish = useCallback(() => {
    setView("results");
    const correct = answers.reduce<number>(
      (acc, a, i) => acc + (a !== null && QUESTIONS[i].options[a].c ? 1 : 0),
      0,
    );
    toast.success("Exam submitted", {
      description: `You scored ${correct}/${QUESTIONS.length} (${Math.round((correct / QUESTIONS.length) * 100)}%).`,
    });
  }, [answers]);

  const handleSubmit = () => {
    const unanswered = answers.filter((a) => a === null).length;

    if (unanswered > 0) {
      toast.warning(`${unanswered} unanswered question${unanswered === 1 ? "" : "s"}`, {
        description: "Do you still want to submit the exam?",
        duration: 15000,
        action: {
          label: "Submit anyway",
          onClick: () => finish(),
        },
        cancel: {
          label: "Keep answering",
          onClick: () => {},
        },
      });
    } else {
      finish();
    }
  };

  const handlePick = (optionIndex: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === current ? optionIndex : a)));
  };

  const toggleFlag = (index: number) => {
    setFlags((prev) => {
      const next = !prev[index];
      if (next) toast.info(`Question ${index + 1} flagged for review`);
      else toast(`Flag removed from question ${index + 1}`);
      return prev.map((f, i) => (i === index ? next : f));
    });
  };

  return (
    <div className="min-h-screen bg-surface text-dark">
      {view === "landing" && <Landing onStart={startExam} />}

      {view === "exam" && (
        <ExamView
          current={current}
          answers={answers}
          flags={flags}
          onPick={handlePick}
          onJump={setCurrent}
          onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
          onNext={() => setCurrent((c) => Math.min(QUESTIONS.length - 1, c + 1))}
          onSubmit={handleSubmit}
          onToggleFlag={toggleFlag}
        />
      )}

      {view === "results" && <Results answers={answers} onRetake={retakeExam} />}
    </div>
  );
}

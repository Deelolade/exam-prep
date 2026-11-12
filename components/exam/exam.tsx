"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Question, Section } from "@/data/questions";
import Landing from "./landing";
import ExamView from "./exam-view";
import Results from "./results";

type View = "landing" | "exam" | "results";

type ExamProps = {
  sections: Section[];
  questions: Question[];
  examName?: string;
  examId?: string;
};

export default function Exam({ sections, questions, examName, examId }: ExamProps) {
  const total = questions.length;
  const [view, setView] = useState<View>("landing");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(total).fill(null));
  const [flags, setFlags] = useState<boolean[]>(() => new Array(total).fill(false));
  const savingRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, current]);

  const reset = useCallback(() => {
    setAnswers(new Array(total).fill(null));
    setFlags(new Array(total).fill(false));
    setCurrent(0);
  }, [total]);

  const startExam = () => {
    reset();
    setView("exam");
  };

  const retakeExam = () => {
    reset();
    setView("landing");
  };

  /**
   * Persists the completed attempt (answers + score) so it shows up in
   * progress. Best-effort: results are shown either way.
   */
  const saveScore = useCallback(
    async (correct: number) => {
      if (!examId || savingRef.current) return;
      savingRef.current = true;

      const submitted: { question_id: string; selected_index: number }[] = [];
      for (let i = 0; i < total; i++) {
        const picked = answers[i];
        const questionId = questions[i]?.id;
        if (picked !== null && questionId) {
          submitted.push({ question_id: questionId, selected_index: picked });
        }
      }

      try {
        if (submitted.length > 0) {
          const response = await fetch("/api/practice/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exam_id: examId, answers: submitted }),
          });
          const result = await response.json().catch(() => null);

          if (!response.ok) {
            toast.error(result?.error ?? "Couldn't save your score");
            return;
          }
        }
        toast.success("Score saved", {
          description: `You scored ${correct}/${total} (${Math.round((correct / total) * 100)}%).`,
        });
      } catch {
        toast.error("Couldn't save your score");
      } finally {
        savingRef.current = false;
      }
    },
    [examId, answers, questions, total],
  );

  const finish = useCallback(() => {
    setView("results");
    const correct = answers.reduce<number>(
      (acc, a, i) => acc + (a !== null && questions[i].options[a].c ? 1 : 0),
      0,
    );
    void saveScore(correct);
  }, [answers, questions, saveScore]);

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
      {view === "landing" && (
        <Landing
          sections={sections}
          questionCount={total}
          examName={examName}
          onStart={startExam}
        />
      )}

      {view === "exam" && (
        <ExamView
          sections={sections}
          questions={questions}
          current={current}
          answers={answers}
          flags={flags}
          onPick={handlePick}
          onJump={setCurrent}
          onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
          onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
          onSubmit={handleSubmit}
          onToggleFlag={toggleFlag}
        />
      )}

      {view === "results" && (
        <Results sections={sections} questions={questions} answers={answers} onRetake={retakeExam} />
      )}
    </div>
  );
}

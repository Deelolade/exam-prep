import { FiCheck } from "react-icons/fi";

/** Realistic product preview shown on the left panel — understated, not decorative. */
const PREVIEW_OPTIONS = [
  { label: "A", text: "3", state: "" },
  { label: "B", text: "5", state: "correct" },
  { label: "C", text: "7", state: "" },
  { label: "D", text: "9", state: "" },
];

/**
 * Split auth shell — 55% product introduction on the left, 45% form column on the right.
 * The left panel is hidden on small screens.
 */
export default function SplitShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh grid lg:grid-cols-[55%_45%] bg-surface">
      {/* ---------- Left brand panel (55%) ---------- */}
      <aside className="hidden lg:flex flex-col overflow-hidden bg-dark text-white p-12">
        <div className="text-[15px] font-semibold tracking-tight text-white/90">
          ExamPrep<span className="text-white/40">.run</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="font-sans text-[32px] font-semibold leading-[1.15] tracking-tight text-white">
            Prepare smarter. Practice better.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            Practice realistic CBT questions, track your performance, and understand every answer.
          </p>

          {/* subtle, realistic question preview */}
          <p className="mt-8 font-mono text-[10px] tracking-widest uppercase text-white/35">
            Practice preview
          </p>
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                Question 12
              </span>
              <span className="text-[10px] font-medium text-white/40">Mathematics</span>
            </div>
            <p className="text-[14px] leading-snug text-white/85">Solve for x: 3x + 7 = 22.</p>
            <div className="mt-4 flex flex-col gap-1.5">
              {PREVIEW_OPTIONS.map((opt) => {
                const isCorrect = opt.state === "correct";
                return (
                  <div
                    key={opt.label}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${
                      isCorrect ? "border-success/40 bg-success/10" : "border-white/10"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded-full border shrink-0 ${
                        isCorrect ? "border-success bg-success" : "border-white/30"
                      }`}
                    >
                      {isCorrect && <FiCheck className="w-2.5 h-2.5 text-white" aria-hidden="true" />}
                    </span>
                    <span
                      className={`font-mono text-[11px] ${isCorrect ? "text-success" : "text-white/40"}`}
                    >
                      {opt.label}
                    </span>
                    <span className={`text-[13px] ${isCorrect ? "text-white font-medium" : "text-white/70"}`}>
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[11px] tracking-wide text-white/35">
          CBT practice built for serious exam preparation.
        </p>
      </aside>

      {/* ---------- Right form panel (45%) ---------- */}
      <main className="flex items-center justify-center px-5 py-10 bg-white">
        <div className="w-full max-w-sm">
          {/* brand */}
          <div className="mb-10">
            <span className="font-sans text-[20px] font-semibold tracking-tight text-dark">
              ExamPrep<span className="text-[#B98C3E]">.run</span>
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

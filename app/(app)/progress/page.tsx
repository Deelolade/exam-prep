import { CARD, SECTION_TITLE } from "@/components/app/ui";
import ProgressChart from "@/components/app/progress-chart";
import { getExamStats, getScoreHistory, getUserExams } from "@/lib/exam-data";

export default async function ProgressPage() {
  const [exams, stats, sessions] = await Promise.all([
    getUserExams(),
    getExamStats(),
    getScoreHistory(),
  ]);
  const activeExam = exams[0];

  const overallAccuracy =
    stats.totalAnswered > 0 ? Math.round((stats.overallCorrect / stats.totalAnswered) * 100) : null;
  const subjectsPracticed = Object.values(stats.questionsBySubject).filter(
    (s) => s.answered > 0,
  ).length;
  const chartMax = Math.max(...stats.answersByDay.map((d) => d.value), 1);
  const hasPractice = stats.totalAnswered > 0 || sessions.length > 0;

  // Oldest first so the chart reads left → right over time.
  const scoreChartData = [...sessions]
    .reverse()
    .map((s) => ({
      label: new Date(s.completed_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      value: s.score_percent,
    }));
  const bestScore =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.score_percent)) : null;
  const latestScore = sessions[0]?.score_percent ?? null;

  const subjectRows = activeExam
    ? activeExam.subjects
        .map((subject) => {
          const subjectStats = subject.code ? stats.questionsBySubject[subject.code] : undefined;
          return {
            name: subject.name,
            accuracy:
              subjectStats && subjectStats.answered > 0
                ? Math.round((subjectStats.correct / subjectStats.answered) * 100)
                : null,
            answered: subjectStats?.answered ?? 0,
          };
        })
        .filter((row) => row.answered > 0 || row.accuracy !== null)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Progress</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track how your preparation is improving over time.
        </p>
      </div>

      {!hasPractice ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="text-sm font-medium text-dark">No practice yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Answer some questions and your progress will appear here.
          </p>
        </div>
      ) : (
        <>
          <section>
            <h2 className={SECTION_TITLE}>Overview</h2>
            <div className={`${CARD} mt-3 grid grid-cols-3 divide-x divide-slate-100 p-5 sm:p-6`}>
              {[
                { label: "Questions answered", value: String(stats.totalAnswered) },
                { label: "Accuracy", value: overallAccuracy !== null ? `${overallAccuracy}%` : "—" },
                { label: "Subjects practiced", value: String(subjectsPracticed) },
              ].map((metric) => (
                <div key={metric.label} className="px-4 first:pl-0 last:pr-0 sm:px-6">
                  <p className="text-xl font-semibold tracking-tight text-dark sm:text-2xl">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 sm:text-[12px]">{metric.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={SECTION_TITLE}>Scores over time</h2>
            {sessions.length > 0 ? (
              <>
                <div className={`${CARD} mt-3 p-5 sm:p-6`}>
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {[
                      { label: "Attempts", value: String(sessions.length) },
                      { label: "Latest score", value: latestScore !== null ? `${latestScore}%` : "—" },
                      { label: "Best score", value: bestScore !== null ? `${bestScore}%` : "—" },
                    ].map((metric) => (
                      <div key={metric.label} className="px-4 first:pl-0 last:pr-0 sm:px-6">
                        <p className="text-xl font-semibold tracking-tight text-dark sm:text-2xl">
                          {metric.value}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500 sm:text-[12px]">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-[13px] font-medium text-slate-600">Score per attempt (%)</p>
                    <ProgressChart data={scoreChartData} max={100} className="mt-4 max-w-2xl" />
                  </div>
                </div>

                <div className={`${CARD} mt-3 divide-y divide-slate-100 overflow-hidden`}>
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-dark">{session.exam_name}</p>
                        <p className="mt-0.5 text-[12px] text-slate-500">
                          {new Date(session.completed_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          · {session.correct_answers}/{session.total_questions} correct
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[13px] font-semibold ${
                          session.score_percent >= 70
                            ? "bg-success/10 text-success"
                            : session.score_percent >= 50
                              ? "bg-amber-50 text-amber-600"
                              : "bg-error/10 text-error"
                        }`}
                      >
                        {session.score_percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={`${CARD} mt-3 p-6 text-sm text-slate-500`}>
                Finish a practice attempt and your score will be recorded here.
              </div>
            )}
          </section>

          <section>
            <h2 className={SECTION_TITLE}>Practice volume</h2>
            <div className={`${CARD} mt-3 p-5 sm:p-6`}>
              <ProgressChart data={stats.answersByDay} max={chartMax} className="max-w-2xl" />
            </div>
          </section>

          {subjectRows.length > 0 && (
            <section>
              <h2 className={SECTION_TITLE}>By subject</h2>
              <div className={`${CARD} mt-3 divide-y divide-slate-100 overflow-hidden`}>
                {subjectRows.map((row) => (
                  <div key={row.name} className="flex items-center gap-4 px-5 py-4">
                    <span className="w-36 shrink-0 text-sm font-medium text-dark">{row.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${row.accuracy ?? 0}%` }}
                      />
                    </div>
                    <span className="w-24 shrink-0 text-right text-[13px] font-medium text-slate-600">
                      {row.accuracy !== null ? `${row.accuracy}%` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

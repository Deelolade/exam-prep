-- Exam-scoped, AI-generated questions.
-- Each exam gets its own practice set; deleting an exam cascades to its
-- questions (and their practice answers).

alter table public.questions
  add column exam_id uuid references public.exams(id) on delete cascade;

create index questions_exam_id_idx on public.questions (exam_id);

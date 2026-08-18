-- Dedupe exam question sets + guard against duplicate generation.

-- created_at gives stable ordering so the earliest row wins when deduping.
alter table public.questions
  add column created_at timestamptz not null default now();

-- Remove duplicate exam-scoped questions (same exam, same question text),
-- keeping the earliest row.
delete from public.questions a
using public.questions b
where a.exam_id is not null
  and a.exam_id = b.exam_id
  and a.question = b.question
  and a.id > b.id;

-- Concurrent generation runs can no longer insert a second copy.
alter table public.questions
  add constraint questions_exam_id_question_key unique (exam_id, question);

create index questions_exam_id_created_idx on public.questions (exam_id, created_at);

-- Tighten RLS on public.questions so users can only view:
-- 1. Shared seed questions (exam_id is null)
-- 2. Questions belonging to their own exams (exams.user_id = auth.uid())

drop policy if exists "Questions are readable by everyone" on public.questions;

create policy "Users can read seed questions and their own exam questions"
  on public.questions for select
  using (
    exam_id is null
    or exists (
      select 1 from public.exams
      where exams.id = questions.exam_id
        and exams.user_id = auth.uid()
    )
  );

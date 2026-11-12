-- One row per completed practice attempt, recording the user's score so
-- progress can be tracked over time. Deleting an exam cascades to its
-- sessions; deleting a user cascades to all of their sessions.

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  total_questions int not null,
  correct_answers int not null,
  score_percent int not null,
  completed_at timestamptz not null default now()
);

create index practice_sessions_user_id_idx on public.practice_sessions (user_id);

alter table public.practice_sessions enable row level security;

create policy "Users manage their own practice sessions"
  on public.practice_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

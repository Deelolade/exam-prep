-- Exam content + student exam data.
-- Run this before 0003_seed_exam_data.sql.
-- Apply via Supabase Dashboard > SQL editor (in order), or `supabase db push`.

-- ---------- Content (shared) ----------

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  color text not null,
  sort_order int not null default 0
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_code text not null references public.subjects(code) on delete cascade,
  question text not null,
  passage text,
  hint text not null default '',
  options jsonb not null,
  sort_order int not null default 0,
  source text not null default 'seed', -- 'seed' | 'ai'
  model text
);

create index questions_subject_code_idx on public.questions (subject_code);

alter table public.subjects enable row level security;
alter table public.questions enable row level security;

-- Question bank is shared content: readable by anyone (authenticated or not).
create policy "Subjects are readable by everyone"
  on public.subjects for select using (true);

create policy "Questions are readable by everyone"
  on public.questions for select using (true);

-- ---------- Student data ----------

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  institution text,
  exam_date date,
  daily_minutes int,
  level text,
  subjects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index exams_user_id_idx on public.exams (user_id);

alter table public.exams enable row level security;

create policy "Users manage their own exams"
  on public.exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.practice_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_index int not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index practice_answers_user_id_idx on public.practice_answers (user_id);

alter table public.practice_answers enable row level security;

create policy "Users manage their own answers"
  on public.practice_answers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

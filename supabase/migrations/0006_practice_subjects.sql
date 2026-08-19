-- Add the practice subjects offered in the exam wizard, and backfill codes
-- into existing exams' subjects arrays (they were stored with code:null when
-- no matching row existed in the subjects table).

insert into public.subjects (code, name, color, sort_order) values
  ('G', 'English', '#2563EB', 6),
  ('H', 'Biology', '#10B981', 7),
  ('I', 'Physics', '#06B6D4', 8),
  ('J', 'Chemistry', '#F59E0B', 9),
  ('K', 'Computer Engineering', '#A855F7', 10)
on conflict (code) do nothing;

-- Resolve stored subject names to their codes for every exam, keeping any
-- codes that are already set.
update public.exams
set subjects = (
  select coalesce(
    jsonb_agg(
      case
        when s.value->>'code' is not null then s.value
        when sub.code is not null then jsonb_build_object('code', sub.code, 'name', s.value->>'name')
        else s.value
      end
      order by s.ordinality
    ),
    '[]'::jsonb
  )
  from jsonb_array_elements(exams.subjects) with ordinality as s(value)
  left join public.subjects sub on sub.name = s.value->>'name'
)
where jsonb_typeof(subjects) = 'array';

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  choice text not null check (choice in ('yes', 'no')),
  other text,
  created_at timestamptz not null default now()
);

alter table public.survey_responses enable row level security;

drop policy if exists "Anyone can submit survey responses" on public.survey_responses;

create policy "Anyone can submit survey responses"
on public.survey_responses
for insert
to anon
with check (choice in ('yes', 'no'));

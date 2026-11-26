-- Tables for automated event ingestion. Run in Supabase SQL Editor.
create table if not exists public.events_auto (
  id text primary key,
  title text not null,
  start_date date,
  end_date date,
  city text,
  dept text,
  category text default 'autre',
  description text,
  url text not null unique,
  source_name text,
  source_url text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists events_auto_dates_idx on public.events_auto(start_date);
alter table public.events_auto enable row level security;
drop policy if exists "events public read" on public.events_auto;
create policy "events public read" on public.events_auto for select to anon, authenticated using (true);
grant select on public.events_auto to anon, authenticated;
